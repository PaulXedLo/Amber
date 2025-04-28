import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event);
  if (!userId) {
    throw createError({ statusCode: 400, message: "Can not get user ID" });
  }
  try {
    let userData = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));
    return userData[0];
  } catch (error) {
    console.log("Could not get user information", error);
    throw createError({
      statusCode: 500,
      message: "Unable to get user information",
    });
  }
});
