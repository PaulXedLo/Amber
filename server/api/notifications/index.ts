import { comments, notifications, posts, profiles } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();
  // SEND NOTIFICATION
  if (event.method === "POST") {
    const body = await readBody(event);
    const { userId, targetUserId, postId, type, isRead } = body;
    if (!userId || !targetUserId || !postId || !type) {
      console.error("Could not get information");
      throw createError({
        message: "Could not get notif information",
        statusCode: 400,
      });
    }
    try {
      await db
        .insert(notifications)
        .values({
          senderId: userId,
          receiverId: targetUserId,
          postId: postId,
          type: type,
          isRead: isRead,
        })
        .onConflictDoNothing()
        .execute();
      return { status: "sent" };
    } catch (err) {
      console.error("Failed to send notification", err);
      throw createError({
        message: "Failed to send notification",
        statusCode: 500,
      });
    }
  }
  // GET NOTIFICATIONS
  if (event.method === "GET") {
    const query = getQuery(event);
    const { userId } = query;
    if (!userId) {
      console.error("Failed to get userId");
      throw createError({
        message: "Failed to get userId",
        statusCode: 400,
      });
    }
    try {
      const allNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.receiverId, userId))
        .execute();
      return { status: "received", allNotifications };
    } catch (err) {
      console.error("Failed to get notifications for user", err);
      throw createError({
        message: "Failed to get notifications for user",
        statusCode: 500,
      });
    }
  }
  // DELETE NOTIFICATION
  if (event.method === "DELETE") {
    const query = getQuery(event);
    const { targetUserId } = query;
    if (!targetUserId) {
      console.error("Failed to get target user ID");
      throw createError({
        message: "Failed to get target user ID",
        statusCode: 400,
      });
    }
    try {
      await db
        .delete(notifications)
        .where(eq(notifications.receiverId, targetUserId))
        .execute();
      return { status: "deleted" };
    } catch (err) {
      console.error("Failed to delete notification", err);
      throw createError({
        message: "Failed to delete notification",
        statusCode: 500,
      });
    }
  }
});
