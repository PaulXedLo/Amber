import { getDb } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
    const body = await readBody(event);
    const query = getQuery(event);
    const { userId } = query;
    if (!userId) {
      throw createError({ statusCode: 400, message: "Could not get user ID" });
    }
    try {
      await db
        .update(profiles)
        .set({
          ...(body.bio && { bio: body.bio }),
          ...(body.username && { username: body.username }),
          ...(body.fullName && { fullName: body.fullName }),
          ...(body.profilePicture && { profilePicture: body.profilePicture }),
          ...(body.hasOwnProperty("showAge") ? { showAge: body.showAge } : {}),
          ...(body.hasOwnProperty("isPrivate")
            ? { isPrivate: body.isPrivate }
            : {}),
        })
        .where(eq(profiles.id, userId));
    } catch (error) {
      console.log("Could not update profile", error);
      throw createError({
        statusCode: 500,
        message: "Could not update profile",
      });
    }
});
