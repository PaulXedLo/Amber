import { comments, notifications, posts, profiles } from "~/server/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();

  // SEND NOTIFICATION
  if (event.method === "POST") {
    const body = await readBody(event);
    const { userId, targetUserId, postId, type } = body;
    if (!userId || !targetUserId || !type) {
      console.error("Could not get information for notification");
      throw createError({
        message: "Could not get notification information",
        statusCode: 400,
      });
    }

    let valuesToInsert: any = {
      senderId: userId,
      receiverId: targetUserId,
      type: type,
    };

    if (type === "like" || type === "comment") {
      if (!postId) {
        console.error("PostId is required for like or comment notification");
        throw createError({
          message: "PostId is required for this notification type",
          statusCode: 400,
        });
      }
      valuesToInsert.postId = postId;
    }

    try {
      await db.insert(notifications).values(valuesToInsert).execute();
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
    const queryParams = getQuery(event);
    const userId = queryParams.userId as string | undefined;

    if (!userId) {
      console.error("Failed to get userId from query");
      throw createError({
        message: "Failed to get userId",
        statusCode: 400,
      });
    }

    try {
      const notificationsData = await db
        .select({
          // Notification fields
          id: notifications.id,
          type: notifications.type,
          createdAt: notifications.createdAt,
          isRead: notifications.isRead,
          notificationPostId: notifications.postId,
          notificationSenderId: notifications.senderId,

          // Sender profile fields
          senderId: profiles.id,
          senderFullName: profiles.fullName,
          senderUsername: profiles.username,
          senderProfilePicture: profiles.profilePicture,

          // Related post fields
          postId: posts.id,
          postContentText: posts.contentText,
          postContentImage: posts.contentImage,
          commentContent: sql<string>`(
            CASE
              WHEN ${notifications.type} = 'comment' THEN (
                SELECT ${comments.content}
                FROM ${comments}
                WHERE ${comments.postId} = ${notifications.postId}
                  AND ${comments.userId} = ${notifications.senderId}
                ORDER BY ${comments.createdAt} DESC
                LIMIT 1
              )
              ELSE NULL
            END
          )`.as("comment_content"),
        })
        .from(notifications)
        .where(eq(notifications.receiverId, userId))
        .leftJoin(profiles, eq(profiles.id, notifications.senderId))
        .leftJoin(posts, eq(posts.id, notifications.postId))
        .orderBy(sql`notifications.created_at DESC`)
        .limit(10)
        .execute();

      return { data: notificationsData || [] };
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
    const queryParams = getQuery(event);
    // Check for clear all action first
    if (queryParams.userId && event.path?.endsWith("/clear")) {
      const userId = queryParams.userId as string;
      try {
        await db
          .delete(notifications)
          .where(eq(notifications.receiverId, userId))
          .execute();
        return { status: "all_deleted" };
      } catch (err) {
        console.error("Failed to clear all notifications", err);
        throw createError({
          message: "Failed to clear all notifications",
          statusCode: 500,
        });
      }
    }

    const notificationId = queryParams.notificationId as string | undefined;
    if (!notificationId) {
      console.error("Failed to get notification ID");
      throw createError({
        message: "Failed to get notification ID",
        statusCode: 400,
      });
    }
    try {
      await db
        .delete(notifications)
        .where(eq(notifications.id, notificationId))
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

  // MARK NOTIFICATION AS READ
  if (event.method === "PATCH") {
    const queryParams = getQuery(event);
    const notificationId = queryParams.notificationId as string | undefined;
    if (!notificationId) {
      console.error("Failed to get notification ID");
      throw createError({
        message: "Failed to get notification ID",
        statusCode: 400,
      });
    }
    try {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId))
        .execute();
      return { success: true };
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      throw createError({
        message: "Failed to mark notification as read",
        statusCode: 500,
      });
    }
  }
});
