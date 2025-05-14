import type { Notification, NotificationPayload } from "~/types/notification";

export function useNotifications() {
  const user = useUserStore();
  const toast = useToast();

  const showNotifications = ref(false);
  const notifications = ref<Notification[]>([]);
  const unreadNotifications = ref(0);
  const loading = ref(false);

  // INTERNAL FETCH NOTIFICATIONS (WITHOUT LOADING STATE)
  // This function fetches notifications for the authenticated user
  async function fetchNotificationsInternal() {
    if (!user.userId) {
      console.error("Could not get userId for fetching notifications");
      return;
    }
    try {
      const response = await $fetch<{
        data: Notification[];
        unreadCount: number;
      }>("/api/notifications", {
        method: "GET",
        query: { userId: user.userId },
      });

      notifications.value = response.data;
      unreadNotifications.value = response.unreadCount;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      notifications.value = [];
      unreadNotifications.value = 0;
    }
  }

  // FETCH NOTIFICATIONS WITH LOADING STATE
  // This function fetches notifications and sets the loading state
  // It uses the fetchNotificationsInternal function to get the data
  async function fetchNotifications() {
    loading.value = true;
    try {
      await fetchNotificationsInternal();
    } finally {
      loading.value = false;
    }
  }

  // SEND OR DELETE NOTIFICATION
  // This function sends or deletes a notification based on the type
  // It takes a NotificationPayload object as an argument
  async function toggleNotification(values: NotificationPayload) {
    if (!user.userId || !values) {
      console.error("Could not get userId or notification values");
      return;
    }

    if (["like", "comment", "follow", "request"].includes(values.type)) {
      try {
        const { status } = await $fetch<{ status: string }>(
          "/api/notifications",
          {
            method: "POST",
            body: {
              userId: user.userId,
              targetUserId: values.targetUserId,
              postId: values.postId,
              type: values.type,
            },
          }
        );

        return status === "sent";
      } catch (err) {
        console.error("Failed to send notification", err);
        return false;
      }
    }

    return false;
  }

  // DELETE NOTIFICATION API CALL
  // This function deletes a notification by its ID
  async function deleteNotificationAPI(notificationId: string) {
    if (!notificationId) {
      console.error("Notification ID is required to delete");
      return false;
    }

    try {
      await $fetch("/api/notifications", {
        method: "DELETE",
        query: { notificationId },
      });
      return true;
    } catch (err) {
      console.error("Failed to delete notification via API", err);
      return false;
    }
  }

  // DELETE NOTIFICATION AND REFRESH
  // This function deletes a notification by its ID and refreshes the notifications
  async function deleteNotification(notificationId: string) {
    loading.value = true;
    try {
      const success = await deleteNotificationAPI(notificationId);
      if (success) await fetchNotificationsInternal();
      return success;
    } finally {
      loading.value = false;
    }
  }

  // CLEAR ALL NOTIFICATIONS
  // This function clears all notifications for the authenticated user
  // It sets the loading state while performing the operation
  async function clearNotifications() {
    loading.value = true;
    try {
      await $fetch("/api/notifications/clear", {
        method: "DELETE",
        query: { userId: user.userId },
      });
      await fetchNotificationsInternal();
    } catch (err) {
      console.error("Failed to clear notifications", err);
    } finally {
      loading.value = false;
    }
  }

  // ACCEPT FOLLOW REQUEST
  // This function accepts a follow request from another user
  // It removes the notificaiton and follow request in the database and posts a new follower
  async function acceptRequest(targetUserId: string, notificationId: string) {
    if (!user.userId || !targetUserId) {
      console.error("Missing userId or targetUserId");
      return;
    }
    loading.value = true;

    try {
      await $fetch("/api/followrequest", {
        method: "POST",
        body: { userId: user.userId, targetUserId },
      });

      await deleteNotificationAPI(notificationId);

      toast.success({
        message: "Successfully accepted follow request",
        timeout: 3000,
        position: "topRight",
      });

      await fetchNotificationsInternal();
    } catch (err) {
      console.error("Failed to accept request", err);
      toast.error({
        message: "Failed to accept follow request",
        timeout: 3000,
        position: "topRight",
      });
    } finally {
      loading.value = false;
    }
  }
  return {
    fetchNotifications,
    notifications,
    deleteNotification,
    acceptRequest,
    clearNotifications,
    unreadNotifications,
    loading,
    showNotifications,
    toggleNotification,
  };
}
