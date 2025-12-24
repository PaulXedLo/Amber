import { getDb } from "~/server/db";
import { followers, followRequests } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const body = await readBody(event);
  const { userId, targetUserId, isPrivate } = body;

  if (!userId || !targetUserId) {
    throw createError({
      statusCode: 400,
      message: "Missing userId or followingUserId",
    });
  }

  // DELETE REQUEST TO A PRIVATE ACCOUNT
  if (isPrivate === true) {
    try {
      await db
        .delete(followRequests)
        .where(
          and(
            eq(followRequests.requesterId, userId),
            eq(followRequests.targetId, targetUserId)
          )
        )
        .execute();
      await db
        .delete(followers)
        .where(
          and(
            eq(followers.followerId, userId),
            eq(followers.followingId, targetUserId)
          )
        )
        .execute();
      return { status: "unfollowed" };
    } catch (error) {
      console.error("Follow API error:", error);
      throw createError({
        statusCode: 500,
        message: "Follow request failed",
      });
    }
  }
  // DELETE FOLLOW TO A PUBLIC ACCOUNT
  else if (isPrivate === false) {
    try {
      await db
        .delete(followers)
        .where(
          and(
            eq(followers.followerId, userId),
            eq(followers.followingId, targetUserId)
          )
        )
        .execute();
      return { status: "unfollowed" };
    } catch (error) {
      console.error("Follow API error:", error);
      throw createError({
        statusCode: 500,
        message: "Follow/unfollow failed",
      });
    }
  }
});