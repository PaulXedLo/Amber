export function useNotifications() {
  const user = useUserStore();
  let showNotifications = ref(false);
  const notifications: any = ref([]);
  const unreadNotifications = ref(0);
  const loading = ref(false);
  // FETCH NOTIFICATIONS
  async function fetchNotifications() {
    // HANDLE ERROR
    loading.value = true;
    if (!user.userId) {
      console.error("Could not get userId");
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
      console.log(unreadNotifications);
      loading.value = false;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      notifications.value = [];
      unreadNotifications.value = 0;
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
      values.type === "follow"
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
  async function deleteNotification(notificationId: string) {
    loading.value = true;
    if (!notificationId) {
      console.error("Could not get notificationId");
      return;
    }
    try {
      await $fetch("/api/notifications", {
        method: "DELETE",
        query: { notificationId },
      });
      await fetchNotifications();
      loading.value = false;
      return true;
    } catch (err) {
      console.error("Failed to delete notification", err);
      loading.value = false;
      return false;
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
      await fetchNotifications();
      loading.value = false;
      return;
    } catch (err) {
      console.error("Failed to clear notifications", err);
      loading.value = false;
      return;
    }
  }
  return {
    fetchNotifications,
    notifications,
    deleteNotification,
    clearNotifications,
    unreadNotifications,
    loading,
    showNotifications,
    toggleNotification,
  };
}
