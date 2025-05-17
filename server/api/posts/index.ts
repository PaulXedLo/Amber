import { getDb } from "~/server/db";
import {
  posts,
  profiles,
  postLikes,
  reports,
  comments,
} from "~/server/db/schema";
import { desc, eq, sql, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  // NEW POST
  if (event.method === "POST") {
    const body = await readBody(event);

    const { userId, contentText, contentImage, feeling } = body;

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "Missing userId",
      });
    }

    try {
      const insertedPost = await db
        .insert(posts)
        .values({
          userId,
          contentText,
          contentImage,
          feeling,
        })
        .returning();

      return insertedPost[0];
    } catch (error) {
      console.error("Insert Post Error:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to create post",
      });
    }
  }
  // GET POST(s)
  if (event.method === "GET") {
    const query = getQuery(event);
    const { userId } = query;

    function normalizePosts(rawPosts: any[]) {
      return rawPosts.map(({ posts: postData, likedByMe, ...rest }) => ({
        ...rest,
        profiles: rest.profiles,
        posts: {
          ...postData,
          likedByMe: likedByMe === true,
        },
      }));
    }

    let userPosts: any[] = [];
    if (userId) {
      userPosts = await db
        .select({
          posts,
          profiles,
          likedByMe: sql`CASE WHEN ${postLikes.id} IS NULL THEN false ELSE true END`,
        })
        .from(posts)
        .leftJoin(profiles, eq(posts.userId, profiles.id))
        .leftJoin(
          postLikes,
          and(eq(postLikes.postId, posts.id), eq(postLikes.userId, userId))
        )
        .where(eq(posts.userId, userId))
        .orderBy(desc(posts.createdAt));
    }

    const allPosts = await db
      .select({
        posts,
        profiles,
        likedByMe: sql`CASE WHEN ${postLikes.id} IS NULL THEN false ELSE true END`,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.id))
      .leftJoin(
        postLikes,
        and(eq(postLikes.postId, posts.id), eq(postLikes.userId, userId))
      )
      .orderBy(desc(posts.createdAt));

    return {
      userPosts: normalizePosts(userPosts),
      allPosts: normalizePosts(allPosts),
    };
  }
  // DELETE POST
  if (event.method === "DELETE") {
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
  }
});
