import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import * as schema from "./schema";
import { useRuntimeConfig } from "#imports";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const config = useRuntimeConfig();
    if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
      throw new Error(
        "❌ Supabase URL or Anon Key is missing in runtimeConfig.public"
      );
    }
    supabaseInstance = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    );
    console.log("Supabase client initialized.");
  }
  return supabaseInstance;
}

let postgresClientInstance: Sql | null = null;
let drizzleDbInstance: PostgresJsDatabase<typeof schema> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!drizzleDbInstance) {
    const config = useRuntimeConfig();

    if (!config.databaseUrl) {
      throw new Error("❌ DATABASE_URL is missing in runtimeConfig");
    }
    postgresClientInstance = postgres(config.databaseUrl, {
      ssl: "require",
      max: 200,
    });
    console.log("Postgres.js client initialized.");
    drizzleDbInstance = drizzle(postgresClientInstance, { schema });
    console.log("Drizzle ORM instance initialized.");
  }
  return drizzleDbInstance;
}

export async function closeDbConnection() {
  if (postgresClientInstance) {
    await postgresClientInstance.end({ timeout: 5 });
    console.log("Postgres.js client connection closed.");
    postgresClientInstance = null;
    drizzleDbInstance = null;
  }
  if (supabaseInstance) {
    console.log(
      "Supabase client instance cleared (no explicit close needed for JS client)."
    );
    supabaseInstance = null;
  }
}
