import { getDb } from "~/server/db";
import { posts, profiles, reports } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  if (event.method === "POST") {
    const query = getQuery(event);
    const { userId, postId } = query;
    if (!userId || !postId) {
      console.log("Could not get user or post id");
      throw createError({
        statusCode: 400,
        message: "Could not get user or post ID",
      });
    }
    try {
      await db
        .insert(reports)
        .values({ userId: userId, postId: postId })
        .execute();

      return { success: true };
    } catch (error) {
      console.log(error);
      throw createError({ statusCode: 500, message: "Could not post report" });
    }
  }
});
