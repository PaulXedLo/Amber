export interface Notification {
  // Notification fields
  id: string;
  type: "like" | "comment" | "follow" | "request";
  notificationPostId?: string;
  notificationSenderId?: string;
  createdAt: string;
  isRead: boolean;
  // Related Post fields
  postId?: string;
  postContentText?: string | null;
  postContentImage?: string;
  commentContent?: string;
  // Sender Profile fields
  senderId?: string;
  senderFullName?: string;
  senderUsername?: string;
  senderProfilePicture: string;
}

export interface NotificationPayload {
  targetUserId: string;
  postId?: string;
  type: "like" | "unlike" | "comment" | "follow" | "request" | "accept";
}
