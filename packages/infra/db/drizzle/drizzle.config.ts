import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/mod.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      Deno.env.get("DATABASE_URL") ||
      "postgres://user:password@localhost:5432/db",
  },
});
