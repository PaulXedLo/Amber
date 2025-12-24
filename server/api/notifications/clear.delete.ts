
import { notifications } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const queryParams = getQuery(event);
  const userId = queryParams.userId as string;

  if (!userId) throw createError({ statusCode: 400, statusMessage: "Missing User ID" });

  try {
    await db.delete(notifications).where(eq(notifications.receiverId, userId)).execute();
    return { status: "all_deleted" };
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: "Failed to clear all" });
  }
});