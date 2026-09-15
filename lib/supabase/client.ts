import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type { Database, Json, Tables, TablesInsert, TablesUpdate } from "./database.types";

export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type Player = Database["public"]["Tables"]["players"]["Row"];
export type TacticalBoard = Database["public"]["Tables"]["tactical_boards"]["Row"];
export type BoardPosition = Database["public"]["Tables"]["board_positions"]["Row"];

let client: SupabaseClient<Database> | undefined;

// Lazy initialization lets the scaffold run before Supabase is configured.
export function getSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local before using Supabase.");
  }

  client ??= createClient<Database>(url, key);
  return client;
}
