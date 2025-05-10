import { getDb } from "~/server/db";
import { followers, followRequests } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const query = getQuery(event);
  const userId = query.userId as string | undefined;
  const targetUserId = query.targetUserId as string | undefined;

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
      return { isFollowing: true, status: "followed" };
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
      return { isFollowing: false, status: "pending" };
    }

    return { isFollowing: false, status: "unfollowed" };
  } catch (error) {
    console.error("Could not check if user follows:", error);
    throw createError({
      statusCode: 500,
      message: "Could not check if user is following profile",
    });
  }
});
