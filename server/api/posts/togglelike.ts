import { db } from "~/server/db";
import { postLikes, posts } from "~/server/db/schema";
import { eq, sql, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    const body = await readBody(event);
    const { userId, postId } = body;
    if (!userId || !postId) {
      throw createError({
        statusCode: 400,
        message: "Could not get user id or post id",
      });
    }
    // INSERT USER LIKED SPECIFIC POST
    try {
      await db
        .insert(postLikes)
        .values({ userId, postId })
        .onConflictDoNothing()
        .execute();

      await db
        .update(posts)
        .set({ likesCount: sql`${posts.likesCount} + 1` })
        .where(eq(posts.id, postId))
        .execute();
      return { success: true };
    } catch (error) {
      console.log("Could not add like to the post", error);
      throw createError({ statusCode: 500, message: "Could not like post" });
    }
  }
  if (event.method === "DELETE") {
    const body = await readBody(event);
    const { userId, postId } = body;
    if (!userId || !postId) {
      throw createError({
        statusCode: 400,
        message: "Could not get user id or post id",
      });
    }
    // DELETE LIKE FROM POST
    try {
      await db
        .delete(postLikes)
        .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)))
        .execute();
      await db
        .update(posts)
        .set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` })
        .where(eq(posts.id, postId))
        .execute();
      return { success: true };
    } catch (error) {
      console.log("Could not remove like from the post", error);
      throw createError({ statusCode: 500, message: "Could not unlike post" });
    }
  }
});
