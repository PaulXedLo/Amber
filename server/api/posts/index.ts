import { db } from "~/server/db";
import { posts, profiles, postLikes } from "~/server/db/schema";
import { desc, eq, sql, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
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
});
