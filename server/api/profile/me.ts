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
    // 1. Fetch user profile + post list
    const userDataResult = await db
      .select()
      .from(profiles)
      .leftJoin(posts, eq(profiles.id, posts.userId))
      .where(eq(profiles.id, userId as string));

    if (!userDataResult || userDataResult.length === 0) {
      // Corrected check
      console.warn(`[${userId}] User not found in database.`);
      throw createError({ statusCode: 404, message: "User not found" });
    }

    const profileInfo = userDataResult[0]?.profiles;
    if (!profileInfo) {
      console.warn(`[${userId}] Profile data missing in userDataResult.`);
      throw createError({
        statusCode: 404,
        message: "User profile data missing",
      });
    }

    const postsList = userDataResult
      .filter((item) => item.posts !== null)
      .map((item) => item.posts);

    // 2. Followers count

    const followersResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(followers)
      .where(eq(followers.followingId, userId as string));
    const followersCount = followersResult[0]?.count ?? 0;

    // 3. Following count
    const followingResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(followers)
      .where(eq(followers.followerId, userId as string));
    const followingCount = followingResult[0]?.count ?? 0;

    // 4. Posts count
    const postsCountResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(posts)
      .where(eq(posts.userId, userId as string));
    const postsCount = postsCountResult[0]?.count ?? 0;
    const userNotificationPreferences = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId as string))
      .execute();
    const preferences = userNotificationPreferences[0];
    return {
      profiles: profileInfo,
      posts: postsList,
      followersCount,
      followingCount,
      postsCount,
      notificationPreferences: preferences,
    };
  } catch (error: any) {
    console.error(
      `[${userId || "UNKNOWN_USER"}] Error in /api/profile/me:`,
      error
    );
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message:
        "Unable to load profile. An unexpected error occurred on the server.",
      data: { originalError: error.message },
    });
  }
});
