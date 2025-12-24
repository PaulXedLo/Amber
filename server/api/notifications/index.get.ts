import { comments, notifications, posts, profiles } from "~/server/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const queryParams = getQuery(event);
  const userId = queryParams.userId as string | undefined;

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: "Failed to get userId" });
  }

  try {
    const notificationsData = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        createdAt: notifications.createdAt,
        isRead: notifications.isRead,
        notificationPostId: notifications.postId,
        notificationSenderId: notifications.senderId,
        senderId: profiles.id,
        senderFullName: profiles.fullName,
        senderUsername: profiles.username,
        senderProfilePicture: profiles.profilePicture,
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

    const unreadCountResult = await db
      .select({
        count: sql<number>`count(${notifications.id})`.mapWith(Number),
      })
      .from(notifications)
      .where(and(eq(notifications.receiverId, userId), eq(notifications.isRead, false)))
      .execute();

    return {
      data: notificationsData || [],
      unreadCount: unreadCountResult[0]?.count || 0,
    };
  } catch (err) {
    console.error("Failed to get notifications", err);
    throw createError({ statusCode: 500, statusMessage: "Failed to get notifications" });
  }
});