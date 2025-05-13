import { notifications } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();
  // CLEAR ALL NOTIFICATIONS
  if (event.method === "DELETE") {
    const query = getQuery(event);
    const { userId } = query;
    if (!userId) {
      console.error("Failed to get userId or target user ID");
      throw createError({
        message: "Failed to get userId or target user ID",
        statusCode: 400,
      });
    }
    try {
      await db
        .delete(notifications)
        .where(eq(notifications.receiverId, userId))
        .execute();
      return { success: true };
    } catch (err) {
      console.error("Failed to clear notifications", err);
      throw createError({
        message: "Failed to clear notifications",
        statusCode: 500,
      });
    }
  }
});
