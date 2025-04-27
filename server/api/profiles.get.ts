import { db } from "~/server/db";
import { profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const allProfiles = await db.select().from(profiles);

  return allProfiles;
});
