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

  // SEND REQUEST TO A PRIVATE ACCOUNT
  if (isPrivate === true) {
    try {
      await db
        .insert(followRequests)
        .values({
          requesterId: userId,
          targetId: targetUserId,
        })
        .onConflictDoNothing()
        .execute();
      return { status: "pending" };
    } catch (error) {
      console.error("Follow API error:", error);
      throw createError({
        statusCode: 500,
        message: "Follow request failed",
      });
    }
  }
  // SEND FOLLOW TO A PUBLIC ACCOUNT
  else if (isPrivate === false) {
    try {
      await db
        .insert(followers)
        .values({
          followerId: userId,
          followingId: targetUserId,
          status: "followed",
        })
        .onConflictDoNothing()
        .execute();

      return { status: "followed" };
    } catch (error) {
      console.error("Follow API error:", error);
      throw createError({
        statusCode: 500,
        message: "Follow/unfollow failed",
      });
    }
  }
});