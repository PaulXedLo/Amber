import { notificationPreferences } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { getDb } from "~/server/db";

const allowedTypes = ["likes", "comments", "follows"] as const;

export default defineEventHandler(async (event) => {
  const db = getDb();
  // Update notification preferences
  if (event.method === "PATCH") {
    // Get the userId and type from the query parameters
    const queryParams = getQuery(event);
    const type = event.context.params?.type as string;
    const { userId } = queryParams;
    // handle the case where userId or type is not provided
    if (!userId) {
      console.error("Failed to get userId");
      throw createError({
        message: "Failed to get userId",
        statusCode: 400,
      });
    }
    if (
      !type ||
      !allowedTypes.includes(type as (typeof allowedTypes)[number])
    ) {
      console.error("Invalid or missing notification type");
      throw createError({
        message: "Invalid or missing notification type",
        statusCode: 400,
      });
    }
    // Change preferences
    try {
      await db
        .update(notificationPreferences)
        .set({
          [type]: sql`NOT ${
            notificationPreferences[
              type as keyof typeof notificationPreferences
            ]
          }`,
        })
        .where(eq(notificationPreferences.userId, userId))
        .execute();
      return { success: true };
    } catch (err) {
      console.error("Failed to update notification preferences", err);
      throw createError({
        message: "Failed to update notification preferences",
        statusCode: 500,
      });
    }
  }
});
