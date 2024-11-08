import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, migrationClient } from "../connection.ts";

// This script will automatically run all pending migrations
console.log("Running migrations...");

try {
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("Migrations completed successfully");
} catch (error) {
  console.error("Error running migrations:", error);
} finally {
  await migrationClient.end();
}
