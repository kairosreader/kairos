import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // The paths are relative to the db package because it's expected to run
  // this script from inside the db package
  schema: "./drizzle/schema.cjs",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
