import { getDb } from "~/server/db";
import { followers, followRequests } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const body = await readBody(event);
  const { userId, followingUserId, isPrivate } = body;

  if (!userId || !followingUserId) {
    throw createError({
      statusCode: 400,
      message: "Missing userId or followingUserId",
    });
  }
  // SEND/DELETE REQUEST TO A PRIVATE ACCOUNT
  if (isPrivate === true) {
    try {
      if (event.method === "POST") {
        await db
          .insert(followRequests)
          .values({
            requesterId: userId,
            targetId: followingUserId,
          })
          .onConflictDoNothing()
          .execute();
        return { status: "pending" };
      }
      // DELETE REQUEST TO A PRIVATE ACCOUNT
      if (event.method === "DELETE") {
        await db
          .delete(followRequests)
          .where(
            and(
              eq(followRequests.requesterId, userId),
              eq(followRequests.targetId, followingUserId)
            )
          )
          .execute();
        await db
          .delete(followers)
          .where(
            and(
              eq(followers.followerId, userId),
              eq(followers.followingId, followingUserId)
            )
          )
          .execute();
        return { status: "unfollowed" };
      }
    } catch (error) {
      console.error("Follow API error:", error);
      throw createError({
        statusCode: 500,
        message: "Follow request failed",
      });
    }
  }
  //SEND/DELETE FOLLOW TO A PUBLIC ACCOUNT
  else if (isPrivate === false) {
    try {
      if (event.method === "POST") {
        await db
          .insert(followers)
          .values({
            followerId: userId,
            followingId: followingUserId,
            status: "accepted",
          })
          .onConflictDoNothing()
          .execute();
        return { status: "followed" };
      }

      if (event.method === "DELETE") {
        await db
          .delete(followers)
          .where(
            and(
              eq(followers.followerId, userId),
              eq(followers.followingId, followingUserId)
            )
          )
          .execute();
        return { status: "unfollowed" };
      }
    } catch (error) {
      console.error("Follow API error:", error);
      throw createError({
        statusCode: 500,
        message: "Follow/unfollow failed",
      });
    }
  }
});
