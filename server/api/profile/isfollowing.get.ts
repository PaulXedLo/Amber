import { getDb } from "~/server/db";
import { followers, followRequests } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { IsFollowingResponse } from "~/types/follow";
export default defineEventHandler(async (event) => {
  const db = getDb();
  const { userId, targetUserId } = getQuery(event) as {
    userId?: string;
    targetUserId?: string;
  };
  if (!userId || !targetUserId) {
    throw createError({
      statusCode: 400,
      message: "Missing User ID or Target User ID",
    });
  }

  try {
    const existingFollow = await db
      .select({ status: followers.status })
      .from(followers)
      .where(
        and(
          eq(followers.followerId, userId),
          eq(followers.followingId, targetUserId)
        )
      )
      .limit(1);

    if (existingFollow.length > 0 && existingFollow[0].status === "followed") {
      return <IsFollowingResponse>{ isFollowing: true, status: "followed" };
    }
    const pendingRequest = await db
      .select({ status: followRequests.status })
      .from(followRequests)
      .where(
        and(
          eq(followRequests.requesterId, userId),
          eq(followRequests.targetId, targetUserId)
        )
      )
      .limit(1);

    if (pendingRequest.length > 0 && pendingRequest[0].status === "pending") {
      return <IsFollowingResponse>{ isFollowing: false, status: "pending" };
    }

    return <IsFollowingResponse>{ isFollowing: false, status: "unfollowed" };
  } catch (error) {
    console.error("Could not check if user follows:", error);
    throw createError({
      statusCode: 500,
      message: "Could not check if user is following profile",
    });
  }
});
