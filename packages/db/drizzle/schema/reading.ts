import { integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { items } from "./item.ts";
import { users } from "./user.ts";
import { relations } from "drizzle-orm";

export const readingProgress = pgTable(
  "reading_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    progress: integer("progress").notNull(),
    lastPosition: integer("last_position").notNull(),
    lastReadAt: timestamp("last_read_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    // Only one reading progress per item per user
    unique().on(t.itemId, t.userId),
  ],
);

export const readingProgressRelations = relations(
  readingProgress,
  ({ one }) => ({
    item: one(items, {
      fields: [readingProgress.itemId],
      references: [items.id],
    }),
  }),
);
