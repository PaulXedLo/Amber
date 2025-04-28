import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (value) => {
  const query = getQuery(value);
  const { id } = query;
  if (!id) {
    throw createError({statusCode: 400, message:'Could not get user id'})
  }
  try {
     const [profileData] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id));
      return  profileData
  } catch (error) {
    console.log("Could not load profile", error);
    throw createError({ statusCode: 500, message: "Could not load profile" });
  }
});
