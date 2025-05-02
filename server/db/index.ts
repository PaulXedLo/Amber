import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
config({ path: ".env" });
import * as schema from "./schema";
import postgres from "postgres";

const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseUrl = process.env.SUPABASE_URL || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set!");
  throw new Error("Missing required DATABASE_URL environment variable");
}

let client;
let db;

try {
  client = postgres(databaseUrl, {
    ssl: "require",
    connect_timeout: 10,
    max_lifetime: 60 * 30,
  });

  db = drizzle(client, { schema });

  console.log("Database connection initialized successfully");
} catch (error) {
  console.error("Failed to initialize database connection:", error);
  throw new Error(`Database connection failed: ${error.message}`);
}

export { db };
