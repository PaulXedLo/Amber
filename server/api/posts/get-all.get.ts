import { db } from "~/server/db";
import { posts, profiles } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { userId } = query;

  let userPosts = [];
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
});
