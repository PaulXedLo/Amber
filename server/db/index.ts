import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function getSupabaseClient() {
  const config = useRuntimeConfig();
  return createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);
}

export function getDb() {
  const config = useRuntimeConfig();

  if (!config.databaseUrl) {
    throw new Error("❌ DATABASE_URL is missing in runtimeConfig");
  }

  const client = postgres(config.databaseUrl, { ssl: "require" });
  return drizzle(client, { schema });
}
