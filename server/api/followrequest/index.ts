import { getDb } from "~/server/db";
import { followers, followRequests, notifications } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  if (event.method === "POST") {
    const body = await readBody(event);
    const { userId, targetUserId } = body;
    if (!userId || !targetUserId) {
      console.error("Failed to get userId or targetUserId");
      throw createError({
        message: "Failed to get userId or targetUserId",
        statusCode: 400,
      });
    }
    try {
      Promise.all([
        await db
          .delete(followRequests)
          .where(
            and(
              eq(followRequests.requesterId, targetUserId),
              eq(followRequests.targetId, userId)
            )
          )
          .execute(),
        await db
          .insert(followers)
          .values({
            followingId: userId,
            followerId: targetUserId,
            status: "followed",
          })
          .execute(),
      ]);
      return { status: "accepted" };
    } catch (err) {
      console.error("Failed to accept request", err);
      throw createError({
        message: "Failed to accept request",
        statusCode: 500,
      });
    }
  }
});
