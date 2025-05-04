export function useReport() {
  async function sendReport(userId: any, postId: any) {
    if (!userId || !postId) {
      console.log("Could not get userID or post ID");
      throw new Error("Error getting post or used id");
    }
    try {
      const result = await $fetch("/api/posts/report", {
        method: "POST",
        query: { userId, postId },
      });
      return result;
    } catch (error) {
      console.log("Could not report post");
      throw new Error("Failed to report post");
    }
  }
  return {
    sendReport,
  };
}
