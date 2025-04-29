import { db } from "~/server/db";
import { posts, profiles, followers } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    const body = await readBody(event);
    const { userId, followingUserId } = body;
    if (!userId && !followingUserId) {
      throw createError({
        statusCode: 400,
        message: "Can not get user ID || follower user id",
      });
    }
    try {
      await db
        .insert(followers)
        .values({ followerId: userId, followingId: followingUserId });
    } catch (error) {
      throw createError({ statusCode: 500, message: "Can not follow user" });
    }
  }
  if (event.method === "DELETE") {
    const body = await readBody(event);
    const { userId, followingUserId } = body;
    if (!userId && !followingUserId) {
      throw createError({
        statusCode: 400,
        message: "Can not get user ID || follower user id",
      });
    }
    try {
      await db
        .delete(followers)
        .where(
          and(
            eq(followers.followerId, userId),
            eq(followers.followingId, followingUserId)
          )
        );
    } catch (error) {
      console.log("Could not unfollow user", error);
      throw createError({
        statusCode: 500,
        message: "Could not unfollow user",
      });
    }
  }
});
