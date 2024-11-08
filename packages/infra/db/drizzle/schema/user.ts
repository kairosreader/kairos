import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { UserPreferences } from "@core/user/mod.ts";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  preferences: jsonb("preferences").$type<UserPreferences>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
