export function useFollow() {
  const loading = ref(false);

  const user = useUserStore();
  async function toggleFollowUser(targetUserId: string, isPrivate: boolean) {
    if (!user.userId) {
      console.error("User must be logged in to follow/unfollow.");

      return;
    }
    if (!targetUserId) {
      console.error("Target user ID is missing.");
      return;
    }

    const currentStatus = user.followStatus[targetUserId];
    loading.value = true;

    try {
      if (currentStatus === "followed" || currentStatus === "pending") {
        const { status }: any = await $fetch("/api/profile/follow", {
          method: "DELETE",
          body: {
            userId: user.userId,
            followingUserId: targetUserId,
            isPrivate,
          },
        });

        user.followStatus[targetUserId] =
          status === "unfollowed" ? "unfollowed" : "unfollowed";
      } else {
        const { status }: any = await $fetch("/api/profile/follow", {
          method: "POST",
          body: {
            isPrivate,
            userId: user.userId,
            followingUserId: targetUserId,
          },
        });

        if (status === "pending" || status === "followed") {
          user.followStatus[targetUserId] = status;
        } else {
          console.warn("Unexpected follow status received:", status);
          user.followStatus[targetUserId] = "unfollowed";
        }
      }
    } catch (error) {
      console.error("Could not toggle follow status", error);
    } finally {
      loading.value = false;
    }
  }
  async function checkIfFollowing(targetUserId: string) {
    if (!user.userId || !targetUserId) {
      if (targetUserId) user.followStatus[targetUserId] = "unfollowed";
      return;
    }

    try {
      const { status } = await $fetch("/api/profile/isfollowing", {
        method: "GET",
        query: {
          userId: String(user.userId),
          targetUserId: String(targetUserId),
        },
      });

      if (
        status === "pending" ||
        status === "followed" ||
        status === "unfollowed"
      ) {
        user.followStatus[targetUserId] = status;
      } else {
        console.warn(
          "Invalid follow status received from isfollowing:",
          status
        );
        user.followStatus[targetUserId] = "unfollowed";
      }
    } catch (error) {
      console.error("Failed to check follow status", error);
      user.followStatus[targetUserId] = "unfollowed";
    }
  }
  return {
    loading,
    toggleFollowUser,
    checkIfFollowing,
  };
}
