import { db } from "~/server/db";
import { posts, profiles, postLikes } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const query = getQuery(event);
  const userId = query.userId;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing Post ID",
    });
  }

  try {
    // Fetch post + profile + likedByMe
    const postData = await db
      .select({
        post: posts,
        profile: profiles,
        likedByMe: sql`CASE WHEN ${postLikes.id} IS NULL THEN false ELSE true END`,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.id))
      .leftJoin(
        postLikes,
        and(eq(postLikes.postId, posts.id), eq(postLikes.userId, userId))
      )
      .where(eq(posts.id, id))
      .limit(1);

    const result = postData[0];

    if (!result) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }
    const normalized = {
      post: {
        ...result.post,
        likedByMe: result.likedByMe === true,
      },
      profile: result.profile,
    };

    return normalized;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw createError({
      statusCode: 400,
      message: "Failed to fetch post",
    });
  }
});
