export function useNotifications() {
  const user = useUserStore();
  let showNotifications = ref(false);
  const notifications = ref([]);
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

      const { data, post } = response as any;
      notifications.value = data;
      loading.value = false;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
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
    }
    // DELETE NOTIFICATION
    else {
      try {
        const { status } = await $fetch("/api/notifications", {
          method: "DELETE",
          query: {
            targetUserId: values.targetUserId,
          },
        });
        if (status === "deleted") {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error("Failed to remove notification", err);
        return;
      }
    }
  }
  // MARK NOTIFICATION AS READ

  return {
    fetchNotifications,
    notifications,
    loading,
    showNotifications,
    toggleNotification,
  };
}
