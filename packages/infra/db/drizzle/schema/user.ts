import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { UserPreferences } from "@kairos/shared/types/common";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  preferences: jsonb("preferences").$type<UserPreferences>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
