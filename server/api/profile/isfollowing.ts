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
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.followerId, userId),
          eq(followers.followingId, targetUserId)
        )
      );
    return { isFollowing: follow.length > 0 };
  } catch (error) {
    console.log("Could not check if user follows", error);
    throw createError({
      statusCode: 500,
      message: "Could not check if user is following profiles",
    });
  }
});
