import { getDb } from "~/server/db";
import { posts, profiles, followers } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  console.log("🔍 DATABASE_URL at runtime:", process.env.DATABASE_URL);
  const query = getQuery(event);
  const { userId } = query;
  console.log("Received userId:", userId);

  if (!userId || typeof userId !== "string") {
    throw createError({
      statusCode: 400,
      message: "Invalid or missing user ID",
    });
  }

  try {
    console.log(`[${userId}] Attempting to fetch user profile and posts...`);
    // 1. Fetch user profile + post list
    const userDataResult = await db
      .select()
      .from(profiles)
      .leftJoin(posts, eq(profiles.id, posts.userId))
      .where(eq(profiles.id, userId as string));
    console.log(
      `[${userId}] userDataResult raw:`,
      JSON.stringify(userDataResult)
    );

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
    console.log(`[${userId}] Profile info extracted:`, profileInfo);

    const postsList = userDataResult
      .filter((item) => item.posts !== null)
      .map((item) => item.posts);
    console.log(`[${userId}] Posts list extracted:`, postsList);

    // 2. Followers count
    console.log(`[${userId}] Attempting to fetch followers count...`);
    const followersResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(followers)
      .where(eq(followers.followingId, userId as string));
    const followersCount = followersResult[0]?.count ?? 0;
    console.log(`[${userId}] Followers count:`, followersCount);

    // 3. Following count
    console.log(`[${userId}] Attempting to fetch following count...`);
    const followingResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(followers)
      .where(eq(followers.followerId, userId as string));
    const followingCount = followingResult[0]?.count ?? 0;
    console.log(`[${userId}] Following count:`, followingCount);

    // 4. Posts count
    console.log(`[${userId}] Attempting to fetch posts count...`);
    const postsCountResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(posts)
      .where(eq(posts.userId, userId as string));
    const postsCount = postsCountResult[0]?.count ?? 0;
    console.log(`[${userId}] Posts count:`, postsCount);

    return {
      profiles: profileInfo,
      posts: postsList,
      followersCount,
      followingCount,
      postsCount,
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
