import { getDb } from "~/server/db";
import { comments, profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const query = getQuery(event);
  const { postId } = query;

  if (!postId) {
    throw createError({ statusCode: 400, message: "Missing Post ID" });
  }

  try {
    const allComments = await db
      .select({
        commentId: comments.id,
        commentText: comments.content,
        commentCreatedAt: comments.createdAt,
        userId: profiles.id,
        username: profiles.username,
        profilePicture: profiles.profilePicture,
      })
      .from(comments)
      .leftJoin(profiles, eq(profiles.id, comments.userId))
      .where(eq(comments.postId, postId as string));

    return allComments;
  } catch (error) {
    console.error("Could not get comments", error);
    throw createError({ statusCode: 500, message: "Server error fetching comments" });
  }
});