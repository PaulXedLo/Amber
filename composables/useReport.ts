import type { ReportPostPayload, ReportPostResponse } from "~/types/post";
export function useReport() {
  async function sendReport(
    userId: string,
    postId: string
  ): Promise<ReportPostResponse> {
    if (!userId || !postId) {
      console.log("Could not get userID or post ID");
      throw new Error("Error getting post or used id");
    }
    const payload: ReportPostPayload = {
      userId,
      postId,
    };
    try {
      const result = await $fetch("/api/posts/report", {
        method: "POST",
        query: payload,
      });
      return result as ReportPostResponse;
    } catch (error) {
      console.log("Could not report post");
      throw new Error("Failed to report post");
    }
  }
  return {
    sendReport,
  };
}
