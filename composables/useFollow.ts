import type {
  FollowAPIResponse,
  FollowButtonText,
  FollowStatus,
  FollowStatusType,
  FollowUserPayload,
  IsFollowingResponse,
} from "~/types/follow";
import type { Profile } from "~/types/post";
export function useFollow() {
  const loading = ref<boolean>(false);
  const toast = useToast();
  const user = useUserStore();

  // CHECK FOLLOWING
  async function checkIfFollowing(targetUserId: string) {
    if (!user.userId || !targetUserId) {
      console.log("Could not get userId or targetUserId");
      return;
    }

    try {
      const { status } = await $fetch<IsFollowingResponse>(
        "/api/profile/isfollowing",
        {
          method: "GET",
          query: {
            userId: String(user.userId),
            targetUserId: String(targetUserId),
          },
        }
      );

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
  // FOLLOW / UNFOLLOW / SEND REQUEST
  async function toggleFollowUser(targetUserId: string, isPrivate: boolean) {
    if (!user.userId || !targetUserId) return;

    loading.value = true;
    const currentStatus = user.followStatus[targetUserId];
    const payload: FollowUserPayload = {
      userId: user.userId,
      targetUserId,
      isPrivate,
    };

    try {
      const method =
        currentStatus === "followed" || currentStatus === "pending"
          ? "DELETE"
          : "POST";
      const { status } = await $fetch<FollowAPIResponse>(
        "/api/profile/follow",
        {
          method,
          body: payload,
        }
      );

      const isValidStatus = ["followed", "pending", "unfollowed"].includes(
        status ?? ""
      );
      user.followStatus[targetUserId] = isValidStatus
        ? (status as FollowStatusType)
        : "unfollowed";
    } catch (error) {
      console.error("Could not toggle follow status", error);
      toast.error({
        message: "Something went wrong while updating follow state",
      });
    } finally {
      loading.value = false;
    }
  }
  // GET FOLLOW BUTTON TEXT

  function getFollowButtonText(id: string): FollowButtonText {
    const status: FollowStatus["status"] = user.followStatus[
      id
    ] as FollowStatus["status"];
    switch (status) {
      case "followed":
        return "Unfollow";
      case "pending":
        return "Pending";
      default:
        return "Follow";
    }
  }
  // PROVIDE FOLLOW FEEDBACK

  function getFollowFeedback(id: string, profile: Profile) {
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
