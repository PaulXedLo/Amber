import { getDb } from "~/server/db";
import {
  posts,
  profiles,
  followers,
  notificationPreferences,
} from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const query = getQuery(event);
  const { userId } = query;

  if (!userId || typeof userId !== "string") {
    throw createError({
      statusCode: 400,
      message: "Invalid or missing user ID",
    });
  }

  try {
    // Added promise all as optimization
    const [
      userDataResult,
      followersResult,
      followingResult,
      postsCountResult,
      userPreferencesResult,
    ] = await Promise.all([
      // fetch profile and posts
      db
        .select()
        .from(profiles)
        .leftJoin(posts, eq(profiles.id, posts.userId))
        .where(eq(profiles.id, userId)),

      // fetch followers count
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(followers)
        .where(eq(followers.followingId, userId)),

      // fetch following count
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(followers)
        .where(eq(followers.followerId, userId)),

      // fetch postfs
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(posts)
        .where(eq(posts.userId, userId)),

      // fetch notifications prefreances
      db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, userId)),
    ]);


    // user validation
    if (!userDataResult || userDataResult.length === 0) {
      console.warn(`[${userId}] User not found in database.`);
      throw createError({ statusCode: 404, message: "User not found" });
    }

    const profileInfo = userDataResult[0]?.profiles;
    if (!profileInfo) {
      throw createError({ statusCode: 404, message: "User profile data missing" });
    }

    // get posts
    const postsList = userDataResult
      .filter((item) => item.posts !== null)
      .map((item) => item.posts);
    // get info
    const followersCount = followersResult[0]?.count ?? 0;
    const followingCount = followingResult[0]?.count ?? 0;
    const postsCount = postsCountResult[0]?.count ?? 0;
    const preferences = userPreferencesResult[0] || null;

    return {
      profiles: profileInfo,
      posts: postsList,
      followersCount,
      followingCount,
      postsCount,
      notificationPreferences: preferences,
    };

  } catch (error: any) {
    console.error(`[${userId}] Error in /api/profile/me:`, error);
    
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Unable to load profile.",
    });
  }
});