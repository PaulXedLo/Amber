import { notificationPreferences, notifications } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const body = await readBody(event);
  const { userId, targetUserId, postId, type } = body;

  if (!userId || !targetUserId || !type) {
    throw createError({ statusCode: 400, statusMessage: "Missing info" });
  }

  if (userId === targetUserId) return { status: "ignored_self_action" };

  // Get notification preferences
  const userNotificationPreferences = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, targetUserId))
    .execute();

  const preferences = userNotificationPreferences[0];
  let sendNotification = false;

  if (preferences) {
    if (type === "like") sendNotification = preferences?.likes ?? false;
    if (type === "comment") sendNotification = preferences?.comments ?? false;
    if (type === "follow" || type === "request") sendNotification = preferences.follows ?? false;
  }

  if (!sendNotification) return { status: "not_sent" };

  let valuesToInsert: any = {
    senderId: userId,
    receiverId: targetUserId,
    type: type,
  };

  if ((type === "like" || type === "comment")) {
    if (!postId) throw createError({ statusCode: 400, statusMessage: "PostId required" });
    valuesToInsert.postId = postId;
  }

  try {
    await db.insert(notifications).values(valuesToInsert).execute();
    return { status: "sent" };
  } catch (err) {
    console.error("Failed to send notification", err);
    throw createError({ statusCode: 500, statusMessage: "Failed to send notification" });
  }
});