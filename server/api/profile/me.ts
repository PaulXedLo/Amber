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
    const [
      userDataResult,
      followersCountResult,
      followingCountResult,
      postsCountResult,
    ] = await Promise.all([
      db
        .select()
        .from(profiles)
        .leftJoin(posts, eq(profiles.id, posts.id))
        .where(eq(profiles.id, userId)),

      db
        .select({ count: sql`COUNT(*)` })
        .from(followers)
        .where(eq(followers.followingId, userId)),

      db
        .select({ count: sql`COUNT(*)` })
        .from(followers)
        .where(eq(followers.followerId, userId)),

      db
        .select({ count: sql`COUNT(*)` })
        .from(posts)
        .where(eq(posts.userId, userId)),
    ]);

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
    console.error("Could not get user information", error);
    throw createError({
      statusCode: 500,
      message: "Unable to get user information",
    });
  }
});
