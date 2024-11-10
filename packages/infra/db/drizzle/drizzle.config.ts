import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // The paths are relative to the infra folder because it's expected to run
  // this script from inside the infra folder
  schema: "./db/drizzle/schema.cjs",
  out: "./db/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      Deno.env.get("DATABASE_URL") ||
      "postgres://user:password@localhost:5432/kairos",
  },
});
