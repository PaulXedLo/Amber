import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env" });

if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_ANON_KEY ||
  !process.env.DATABASE_URL
) {
  throw new Error(
    "Missing SUPABASE_URL, SUPABASE_ANON_KEY, or DATABASE_URL in .env"
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
export const db = drizzle(client, { schema });
