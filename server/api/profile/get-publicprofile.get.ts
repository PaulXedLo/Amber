import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { username } = query;
  let userData = [];
  if (username) {
    try {
      userData = await db
        .select()
        .from(profiles)
        .where(eq(profiles.username, username));
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: "Could not fetch user profile",
      });
    }
  }
  return { userData };
});
