import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./user.ts";
import { enumValuesTuple } from "@kairos/shared/utils";
import { ITEM_STATUS, ITEM_TYPE } from "@kairos/shared/constants";
import type { ItemContent } from "@kairos/shared/types";
import { relations } from "drizzle-orm";
import { itemTags } from "./item-tag.ts";
import { readingProgress } from "./reading.ts";

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type", { enum: enumValuesTuple(ITEM_TYPE) }).notNull(),
  status: text("status", { enum: enumValuesTuple(ITEM_STATUS) }).notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  content: jsonb("content").$type<ItemContent>().notNull(),
  estimatedReadTime: integer("estimated_read_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const itemsRelations = relations(items, ({ many }) => ({
  itemTags: many(itemTags),
  // One reading progress per user, but since we always query with userId,
  // it effectively becomes one-to-one in practice
  readingProgress: many(readingProgress),
}));
