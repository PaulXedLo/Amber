import { db } from "~/server/db";
import { posts, profiles, followers } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { username } = event.context.params;
  if (event.method === "GET") {
    let userData = [];
    try {
      // GET PUBLIC USER PROFILE
      userData = await db
        .select()
        .from(profiles)
        .leftJoin(posts, eq(posts.userId, profiles.id))
        .where(eq(profiles.username, username));
      const profileInfo = userData[0].profiles;
      const postsList = userData
        .filter((item) => item.posts !== null)
        .map((item) => item.posts);
      const userId = profileInfo.id;

      //GET FOLLOWERS COUNT, FOLLOWING COUNT and POSTS COUNT IN PARRALEL

      const [followersCountResult, followingCountResult, postsCountResult] =
        await Promise.all([
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

      // STORING COUNT VALUES

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
      console.log("Could not get profile", error);
      throw createError({
        statusCode: 400,
        message: "Could not get user profile",
      });
    }
  }
});
