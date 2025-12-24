import { getDb } from "~/server/db";
import { comments, posts } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const body = await readBody(event);
  const { userId, postId, commentText } = body;

  if (!userId || !postId || !commentText) {
    throw createError({
      statusCode: 400,
      message: "Missing userId, postId or commentText",
    });
  }

  try {
    await db
      .insert(comments)
      .values({ content: commentText, postId: postId, userId: userId });

    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, postId));

    return { success: true };
  } catch (error) {
    console.error("Could not post comment", error);
    throw createError({ statusCode: 500, message: "Failed to post comment" });
  }
});