import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { username } = query;

  if (!username) {
    throw createError({ statusCode: 400, message: "Missing username" });
  }

  try {
    const publicUserData = await db
      .select()
      .from(profiles)
      .leftJoin(posts, eq(posts.userId, profiles.id))
      .where(eq(profiles.username, username));

    if (publicUserData.length === 0) {
      throw createError({ statusCode: 404, message: "User not found" });
    }
    const profileInfo = publicUserData[0].profiles;
    const postsList = publicUserData
      .filter((row) => row.posts !== null)
      .map((row) => row.posts);

    return {
      profiles: profileInfo,
      posts: postsList,
    };
  } catch (error) {
    console.error("Could not fetch user profile", error);
    throw createError({
      statusCode: 500,
      message: "Could not fetch user profile",
    });
  }
});
