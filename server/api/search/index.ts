import { getDb } from "~/server/db";
import { profiles } from "~/server/db/schema";
import { ilike, or } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();

  const query = getQuery(event);
  const searchText = query.q as string;

  if (!searchText || typeof searchText !== "string") {
    throw createError({
      statusCode: 400,
      message: "Invalid search query",
    });
  }

  try {
    const searchTerm = `%${searchText}%`;

    const results = await db
      .select({
        id: profiles.id,
        username: profiles.username,
        fullName: profiles.fullName,
        profilePicture: profiles.profilePicture,
      })
      .from(profiles)
      .where(
        or(
          ilike(profiles.fullName, searchTerm),
          ilike(profiles.username, searchTerm)
        )
      )
      .limit(5);

    return results;
  } catch (error) {
    console.error("Search error:", error);
    throw createError({
      statusCode: 500,
      message: "SERVER error while searching",
    });
  }
});
