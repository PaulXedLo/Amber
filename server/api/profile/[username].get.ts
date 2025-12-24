import { getDb } from "~/server/db";
import {
  posts,
  profiles,
  followers,
  notificationPreferences,
} from "~/server/db/schema";
import { eq, sql, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const { username } = event.context.params;
  const query = getQuery(event);
  const { userId } = query;
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
      const profileId = profileInfo.id;
      // CHECK IF CURRENT LOGGED IN USER IS FOLLOWING THE PROFILE

      let isFollowing = false;
      if (userId) {
        const follow = await db
          .select()
          .from(followers)
          .where(
            and(
              eq(followers.followerId, userId),
              eq(followers.followingId, profileId)
            )
          );
        isFollowing = follow.length > 0;
      }
      //GET FOLLOWERS COUNT, FOLLOWING COUNT and POSTS COUNT IN PARRALEL

      const [followersCountResult, followingCountResult, postsCountResult] =
        await Promise.all([
          db
            .select({ count: sql`COUNT(*)` })
            .from(followers)
            .where(eq(followers.followingId, profileId)),
          db
            .select({ count: sql`COUNT(*)` })
            .from(followers)
            .where(eq(followers.followerId, profileId)),
          db
            .select({ count: sql`COUNT(*)` })
            .from(posts)
            .where(eq(posts.userId, profileId)),
        ]);
      // GET NOTIFICATION PREFERENCES
      const userNotificationPreferences = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, profileId))
        .execute();
      const preferences = userNotificationPreferences[0];
      // STORING COUNT VALUES

      const followersCount = followersCountResult[0].count || 0;
      const followingCount = followingCountResult[0].count || 0;
      const postsCount = postsCountResult[0].count || 0;
      return {
        profiles: profileInfo,
        posts: postsList,
        notificationPreferences: preferences,
        followersCount,
        followingCount,
        isFollowing,
        postsCount,
      };
    } catch (error) {
      console.log("Could not get profile", error);
      throw createError({
        statusCode: 400,
        message: "Could not get user profile",
      });
    }
});
