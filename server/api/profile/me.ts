import { db } from "~/server/db";
import { posts, profiles, followers } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { userId } = query;

  if (!userId) {
    throw createError({ statusCode: 400, message: "Cannot get user ID" });
  }

  try {
    // GET USER PROFILE, GET USER FOLLOWERS COUNT, FOLLOWING COUNT AND POSTS COUNT
    let userDataResult,
      followersCountResult,
      followingCountResult,
      postsCountResult;

    try {
      userDataResult = await db
        .select()
        .from(profiles)
        .leftJoin(posts, eq(profiles.id, posts.userId))
        .where(eq(profiles.id, userId));
    } catch (error) {
      console.error("Failed to fetch user profile data:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to fetch user profile data",
        cause: error,
      });
    }

    try {
      followersCountResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(followers)
        .where(eq(followers.followingId, userId));
    } catch (error) {
      console.error("Failed to fetch followers count:", error);
      followersCountResult = [{ count: 0 }];
    }

    try {
      followingCountResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(followers)
        .where(eq(followers.followerId, userId));
    } catch (error) {
      console.error("Failed to fetch following count:", error);
      followingCountResult = [{ count: 0 }];
    }

    try {
      postsCountResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(posts)
        .where(eq(posts.userId, userId));
    } catch (error) {
      console.error("Failed to fetch posts count:", error);
      postsCountResult = [{ count: 0 }];
    }

    // USER NOT FOUND ERROR HANDLING
    if (
      !userDataResult ||
      userDataResult.length === 0 ||
      !userDataResult[0]?.profiles
    ) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // STORING COUNT VALUES
    const profileInfo = userDataResult[0].profiles;
    const postsList = userDataResult
      .filter((item) => item.posts !== null)
      .map((item) => item.posts);

    const followersCount = followersCountResult[0]?.count || 0;
    const followingCount = followingCountResult[0]?.count || 0;
    const postsCount = postsCountResult[0]?.count || 0;

    return {
      profiles: profileInfo,
      posts: postsList,
      followersCount,
      followingCount,
      postsCount,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw createError({
      statusCode: 500,
      message: "Unable to get user information",
    });
  }
});
