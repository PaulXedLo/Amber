import { notifications } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const queryParams = getQuery(event);
  const notificationId = queryParams.notificationId as string | undefined;

  if (!notificationId) {
    throw createError({ statusCode: 400, statusMessage: "Missing Notification ID" });
  }

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .execute();
    return { success: true };
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: "Failed to mark as read" });
  }
});