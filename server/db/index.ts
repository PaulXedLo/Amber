import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
config({ path: ".env" });
import * as schema from "./schema";
import postgres from "postgres";

const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseUrl = process.env.SUPABASE_URL || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

const client = postgres(process.env.DATABASE_URL!, { ssl: "require" });
export const db = drizzle(client, { schema });
