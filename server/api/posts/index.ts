import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    const body = await readBody(event);

    const { userId, contentText, contentImage, feeling } = body;

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "Missing userId",
      });
    }

    try {
      const insertedPost = await db
        .insert(posts)
        .values({
          userId,
          contentText,
          contentImage,
          feeling,
        })
        .returning();

      return insertedPost[0];
    } catch (error) {
      console.error("Insert Post Error:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to create post",
      });
    }
  }

  if (event.method === "GET") {
    const query = getQuery(event);
    const { userId } = query;

    let userPosts: any = [];
    if (userId) {
      userPosts = await db
        .select()
        .from(posts)
        .leftJoin(profiles, eq(posts.userId, profiles.id))
        .where(eq(posts.userId, userId))
        .orderBy(desc(posts.createdAt));
    }

    const allPosts = await db
      .select()
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.id))
      .orderBy(desc(posts.createdAt));

    return { userPosts, allPosts };
  }
});
