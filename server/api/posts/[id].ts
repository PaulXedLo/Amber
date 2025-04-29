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
    //FETCH POST AND PROFILE
    const postData = await db
      .select({
        posts,
        profiles,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.id))
      .where(eq(posts.id, id))
      .limit(1);

    if (postData.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }
    const postInfo = postData[0];
    return {
      post: {
        id: postInfo.posts.id,
        contentText: postInfo.posts.contentText,
        contentImage: postInfo.posts.contentImage,
        likesCount: postInfo.posts.likesCount,
        createdAt: postInfo.posts.createdAt,
        feeling: postInfo.posts.feeling,
        username: postInfo.profiles?.username || "Unknown",
        fullName: postInfo.profiles?.fullName || "Unknown User",
        profilePicture: postInfo.profiles?.profilePicture || null,
      },
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw createError({
      statusCode: 400,
      message: "Failed to fetch post",
    });
  }
});
