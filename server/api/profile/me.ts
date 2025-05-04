import { db } from "~/server/db";
import { posts, profiles, followers } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { userId } = query;
  console.log(userId);
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "Invalid or missing user ID",
    });
  }

  try {
    // 1. Fetch user profile + post list
    const userDataResult = await db
      .select()
      .from(profiles)
      .leftJoin(posts, eq(profiles.id, posts.userId))
      .where(eq(profiles.id, userId));

    if (!userDataResult || userDataResult.length === 0) {
      throw createError({ statusCode: 404, message: "User not found" });
    }
    console.log("FULL RESULT:", userDataResult);
    const profileInfo = userDataResult[0]?.profiles;
    if (!profileInfo) {
      throw createError({ statusCode: 404, message: "User profile missing" });
    }

    const postsList = userDataResult
      .filter((item) => item.posts !== null)
      .map((item) => item.posts);

    const [{ count: followersCount = 0 }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(followers)
      .where(eq(followers.followingId, userId));

    // 3. Following count
    const [{ count: followingCount = 0 }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(followers)
      .where(eq(followers.followerId, userId));

    // 4. Posts count
    const [{ count: postsCount = 0 }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(posts)
      .where(eq(posts.userId, userId));

    return {
      profiles: profileInfo,
      posts: postsList,
      followersCount,
      followingCount,
      postsCount,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error("Unexpected error in /api/profile/me:", error);
    throw createError({
      statusCode: 500,
      message: "Unable to load profile. Please try again later.",
    });
  }
});
