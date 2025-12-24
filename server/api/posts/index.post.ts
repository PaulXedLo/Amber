import { getDb } from "~/server/db";
import { posts } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const db = getDb();
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
});