import { db } from "~/server/db";
import { comments, posts, profiles } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    const body = await readBody(event);
    const { userId, postId, commentText } = body;
    if (!userId || !postId || !commentText) {
      console.log("Could not get user ID / POST ID / COMMENT");
      throw createError({
        statusCode: 400,
        message: "Could not get userID/postId/Comment",
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
      console.log("Could not post comment", error);
      throw createError({ statusCode: 500, message: "Could not post comment" });
    }
  }
  if (event.method === "GET") {
    const query = getQuery(event);
    const { postId } = query;
    if (!postId) {
      console.log("Could not get post Id");
      throw createError({ statusCode: 400, message: "Could not get comments" });
    }
    try {
      const allComments = await db
        .select({
          commentId: comments.id,
          commentText: comments.content,
          commentCreatedAt: comments.createdAt,
          userId: profiles.id,
          username: profiles.username,
          profilePicture: profiles.profilePicture,
        })
        .from(comments)
        .leftJoin(profiles, eq(profiles.id, comments.userId))
        .where(eq(comments.postId, postId));

      return allComments;
    } catch (error) {
      console.log("Could not get comments");
      throw createError({
        statusCode: 500,
        message: "Could not get comments for this post",
      });
    }
  }
});
