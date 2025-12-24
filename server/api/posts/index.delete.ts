import { getDb } from "~/server/db";
import { posts } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const body = await readBody(event);
  const { postId, userId } = body;
  
  if (!postId || !userId) {
    console.error(
      "DELETE /api/posts - Missing postId or userId in body:",
      body
    );
    throw createError({
      statusCode: 400,
      message: "Post ID and User ID are required.",
    });
  }
  try {
    const deletePostResult = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning({ id: posts.id });
    if (deletePostResult.length === 0) {
      console.warn(
        `Attempted to delete post ${postId} by user ${userId}, but post was not found or user not authorized.`
      );
    }
    return { success: true };
  } catch (error) {
    console.error(
      `DELETE /api/posts - Error deleting post ${postId}:`,
      error
    );
    throw createError({
      statusCode: 500,
      message: `Could not delete post. Reason: ${error.message}`,
    });
  }
});