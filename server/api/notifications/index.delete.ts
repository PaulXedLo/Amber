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
    await db.delete(notifications).where(eq(notifications.id, notificationId)).execute();
    return { status: "deleted" };
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: "Failed to delete" });
  }
});