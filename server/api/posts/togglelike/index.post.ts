import { getDb } from "~/server/db";
import { postLikes, posts } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const body = await readBody(event);
  const { userId, postId } = body;
   // if no userid or postid provided
  if (!userId || !postId) {
    throw createError({
      statusCode: 400,
      message: "Could not get user id or post id",
    });
  }

  try {
    // add the like
    await db
      .insert(postLikes)
      .values({ userId, postId })
      .onConflictDoNothing()
      .execute();
    // increment the likes
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId))
      .execute();

    return { success: true };
  } catch (error) {
    console.error("Could not add like to the post", error);
    throw createError({ statusCode: 500, message: "Could not like post" });
  }
});