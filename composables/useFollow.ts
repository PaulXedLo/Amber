interface FollowAPIResponse {
  status: "pending" | "followed" | "unfollowed";
}
export function useFollow() {
  const loading = ref(false);
  const toast = useToast();
  const user = useUserStore();

  // FOLLOW / UNFOLLOW / SEND REQUEST
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

        if (status === "unfollowed") {
          user.followStatus[targetUserId] = "unfollowed";
        } else {
          console.warn(
            "Unexpected status after DELETE. Expected 'unfollowed', got:",
            status
          );
          user.followStatus[targetUserId] = "unfollowed";
        }
      } else {
        const { status } = await $fetch<FollowAPIResponse>(
          "/api/profile/follow",
          {
            method: "POST",
            body: {
              userId: user.userId,
              followingUserId: targetUserId,
              isPrivate,
            },
          }
        );
        console.log(status);
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

  // CHECK FOLLOWING

  async function checkIfFollowing(targetUserId: string) {
    if (!user.userId || !targetUserId) {
      console.log("Could not get userId or targetUserId");
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
        return;
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

  // GET FOLLOW BUTTON TEXT

  function getFollowButtonText(id: any) {
    let status = user.followStatus[id];
    if (status === "followed") {
      return "Unfollow";
    } else if (status === "pending") {
      return "Pending";
    } else if (status === "unfollowed") {
      return "Follow";
    }
    return status;
  }

  // PROVIDE FOLLOW FEEDBACK

  function getFollowFeedback(id: any, profile: any) {
    if (!id || !profile) {
      return;
    }
    if (user.followStatus[id] === "followed") {
      return toast.success({
        message: `Successfully followed ` + profile.fullName,
        timeout: 3000,
        position: "topRight",
      });
    } else if (user.followStatus[id] === "pending") {
      return toast.info({
        message: "Sent follow request",
        timeout: 3000,
        position: "topRight",
      });
    } else if (user.followStatus[id] === "unfollowed") {
      return toast.success({
        message: `Successfully unfollowed ` + profile.fullName,
        timeout: 3000,
        position: "topRight",
      });
    }
  }
  return {
    loading,
    getFollowFeedback,
    toggleFollowUser,
    getFollowButtonText,
    checkIfFollowing,
  };
}
