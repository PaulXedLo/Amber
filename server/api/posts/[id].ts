import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing Post ID",
    });
  }

  try {
    // FETCH POST AND PROFILE
    const postData = await db
      .select({
        post: posts,
        profile: profiles,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.id))
      .where(eq(posts.id, id))
      .limit(1);

    const result = postData[0];

    if (!result) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw createError({
      statusCode: 400,
      message: "Failed to fetch post",
    });
  }
});
