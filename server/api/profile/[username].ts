import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { username } = event.context.params;
  if (event.method === "GET") {
    let userData = [];
    try {
      userData = await db
        .select()
        .from(profiles)
        .leftJoin(posts, eq(posts.userId, profiles.id))
        .where(eq(profiles.username, username));
      const profileInfo = userData[0].profiles;
      const postsList = userData
        .filter((item) => item.posts !== null)
        .map((item) => item.posts);
      return {
        profiles: profileInfo,
        posts: postsList,
      };
    } catch (error) {
      console.log("Could not get profile", error);
      throw createError({
        statusCode: 400,
        message: "Could not get user profile",
      });
    }
  }
});
