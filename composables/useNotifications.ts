export function useNotifications() {
  const user = useUserStore();
  const toast = useToast();
  let showNotifications = ref(false);
  const notifications: any = ref([]);
  const unreadNotifications = ref(0);
  const loading = ref(false);
  // FETCH NOTIFICATIONS INTERNAL ( NO LOADING STATE )
  async function fetchNotificationsInternal() {
    if (!user.userId) {
      console.error("Could not get userId for fetching notifications");
      return;
    }
    try {
      const response = await $fetch("/api/notifications", {
        method: "GET",
        query: { userId: user.userId },
      });

      const { data, unreadCount } = response as any;
      notifications.value = data;
      unreadNotifications.value = unreadCount;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      notifications.value = [];
      unreadNotifications.value = 0;
    }
  }
  // FETCH NOTIFICATIONS
  async function fetchNotifications() {
    loading.value = true;
    try {
      await fetchNotificationsInternal();
    } finally {
      loading.value = false;
    }
  }

  // SEND OR DELETE NOTIFICATION
  async function toggleNotification(values: any) {
    // HANDLE ERROR
    if (!user.userId || !values) {
      console.error("Could not get userId or values");
      return;
    }
    // SEND NOTIFICATION (LIKE, COMMENT, FOLLOW)
    if (
      values.type === "like" ||
      values.type === "comment" ||
      values.type === "follow" ||
      values.type === "request"
    ) {
      try {
        const { status } = await $fetch("/api/notifications", {
          method: "POST",
          body: {
            userId: user.userId,
            targetUserId: values.targetUserId,
            postId: values.postId,
            type: values.type,
          },
        });
        if (status === "sent") {
          return true;
        } else {
          console.error("Failed to send notification", status);
          return false;
        }
      } catch (err) {
        console.error("Failed to send notification", err);
        return;
      }
    } else {
      return;
    }
  }
  // DELETE NOTIFICATION API
  async function deleteNotificationAPI(notificationId: string) {
    if (!notificationId) {
      console.error("Could not get notificationId for API delete");
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
  // DELETE NOTIFICATION
  async function deleteNotification(notificationId: string) {
    if (!notificationId) {
      console.error("Could not get notificationId");
      return false;
    }
    loading.value = true;
    try {
      const success = await deleteNotificationAPI(notificationId);
      if (success) {
        await fetchNotificationsInternal();
      }
      return success;
    } catch (err) {
      console.error("Failed to delete notification", err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  // CLEAR ALL NOTIFICATIONS
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
  async function acceptRequest(targetUserId: string, notificationId: string) {
    if (!user.userId || !targetUserId) {
      console.error("Could not get userId or targetUserId");
      return;
    }
    loading.value = true;
    try {
      await $fetch("/api/followrequest", {
        method: "POST",
        body: { userId: user.userId, targetUserId },
      });
      await deleteNotificationAPI(notificationId);

      // 3. Show success toast
      toast.success({
        message: "Successfully accepted follow request",
        timeout: 3000,
        position: "topRight",
      });

      // 4. Fetch all notifications to update the list (only once)
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
