import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./user.ts";
import { enumValuesTuple } from "@kairos/shared/utils";
import { ITEM_STATUS, ITEM_TYPE } from "@kairos/shared/constants";
import type { ItemContent } from "@kairos/shared/types/common";

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: enumValuesTuple(ITEM_TYPE) }).notNull(),
  status: text("status", { enum: enumValuesTuple(ITEM_STATUS) }).notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  content: jsonb("content").$type<ItemContent>().notNull(),
  tags: text("tags").array().notNull().default([]),
  estimatedReadTime: integer("estimated_read_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
