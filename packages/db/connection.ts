import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema/mod.ts";

// Connection URL should come from environment variables
const connectionString = Deno.env.get("DATABASE_URL")!;

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// Type-safe database interface
export type Database = typeof db;
