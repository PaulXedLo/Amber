export function useFollow() {
  const loading = ref(false);
  const isFollowing = ref(false);
  const user = useUserStore();
  async function toggleFollowUser(targetUserId: string, isPrivate: boolean) {
    if (user.followStatus[targetUserId] == "unfollowed") {
      loading.value = true;
      try {
        const { status }: any = await $fetch("/api/profile/follow", {
          method: "POST",
          body: {
            isPrivate,
            userId: user.userId,
            followingUserId: targetUserId,
          },
        });
        if (status === "pending") {
          user.followStatus[targetUserId] = "pending";
        } else if (status === "followed") {
          user.followStatus[targetUserId] = "followed";
        } else if (status === "unfollowed") {
          user.followStatus[targetUserId] = "unfollowed";
        }
        loading.value = false;
      } catch (error) {
        console.error("Could not follow user", error);
        loading.value = false;
      }
    } else if (user.followStatus[targetUserId] === "followed") {
      try {
        const { status }: any = await $fetch("/api/profile/follow", {
          method: "DELETE",
          body: {
            userId: user.userId,
            followingUserId: targetUserId,
            isPrivate,
          },
        });
        if (status === "unfollowed") {
          user.followStatus[targetUserId] = "unfollowed";
        }
        loading.value = false;
      } catch (error) {
        console.error("Could not unfollow user", error);
        loading.value = false;
      }
    }
  }
  async function checkIfFollowing(targetUserId: string) {
    if (!targetUserId) {
      console.log("Could not get target user Id");
      return;
    }
    try {
      const { status } = await $fetch("/api/profile/isfollowing", {
        method: "GET",
        query: { userId: user.userId, targetUserId },
      });
      if (status === "pending") {
        user.followStatus[targetUserId] = "pending";
      } else if (status === "followed") {
        user.followStatus[targetUserId] = "followed";
      } else if (status === "unfollowed") {
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
