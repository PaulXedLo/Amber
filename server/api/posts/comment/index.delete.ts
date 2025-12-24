import { getDb } from "~/server/db";
import { comments, posts } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const query = getQuery(event);
  const { commentId, postId } = query;

  if (!commentId || !postId) {
    throw createError({
      statusCode: 400,
      message: "Missing commentId or postId",
    });
  }

  try {
    await db.delete(comments).where(eq(comments.id, commentId as string)).execute();
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} - 1` })
      .where(eq(posts.id, postId as string));

    return { success: true };
  } catch (error) {
    console.error("Could not delete comment", error);
    throw createError({ statusCode: 500, message: "Failed to delete comment" });
  }
});