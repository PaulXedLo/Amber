import { db } from "~/server/db";
import { followers } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

// CHECK IF USER IS FOLLOWING PUBLIC PROFILES

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { userId, targetUserId } = query;
  if (!userId || !targetUserId) {
    throw createError({
      statusCode: 400,
      message: "Missing User ID or Target User ID",
    });
  }
  try {
    const follow = await db
      .select({ status: followers.status })
      .from(followers)
      .where(
        and(
          eq(followers.followerId, userId as string),
          eq(followers.followingId, targetUserId as string)
        )
      )
      .limit(1);

    if (follow.length > 0) {
      return { isFollowing: true, status: "following" };
    } else if (follow.length === 0) {
      return { isFollowing: false, status: "unfollowed" };
    } else {
      return { isFollowing: false, status: "pending" };
    }
  } catch (error) {
    console.log("Could not check if user follows", error);
    throw createError({
      statusCode: 500,
      message: "Could not check if user is following profiles",
    });
  }
});
