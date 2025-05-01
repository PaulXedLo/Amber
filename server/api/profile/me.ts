import { db } from "~/server/db";
import { posts, profiles, followers } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { userId } = query;
  if (!userId) {
    throw createError({ statusCode: 400, message: "Can not get user ID" });
  }
  let userData = [];
  try {
    // GET USER PROFILE, GET USER FOLLOWERS COUNT, FOLLOWING COUNT AND POSTS COUNT
    const [
      userData,
      followersCountResult,
      followingCountResult,
      postsCountResult,
    ] = await Promise.all([
      db
        .select()
        .from(profiles)
        .leftJoin(posts, eq(profiles.id, posts.userId))
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

    // USER NOT FOUND ERRR HANDLING

    // STORING COUNT VALUES
    if (!userData || userData.length === 0 || !userData[0]?.profiles) {
      throw createError({ statusCode: 404, message: "User not found" });
    }
    const profileInfo = userData[0].profiles;
    const postsList = userData
      .filter((item) => item.posts !== null)
      .map((item) => item.posts);
    const followersCount = followersCountResult[0].count || 0;
    const followingCount = followingCountResult[0].count || 0;
    const postsCount = postsCountResult[0].count || 0;

    return {
      profiles: profileInfo,
      posts: postsList,
      followersCount,
      followingCount,
      postsCount,
    };
  } catch (error) {
    console.log("Could not get user information", error);
    throw createError({
      statusCode: 500,
      message: "Unable to get user information",
    });
  }
});
