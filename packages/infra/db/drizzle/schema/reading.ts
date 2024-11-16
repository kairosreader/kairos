import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { items } from "./item.ts";
import { users } from "./user.ts";

export const readingProgress = pgTable("reading_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  progress: integer("progress").notNull(),
  lastPosition: integer("last_position").notNull(),
  lastReadAt: timestamp("last_read_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
