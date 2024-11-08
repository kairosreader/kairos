import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { ItemContent } from "@shared/types/common/mod.ts";
import { ITEM_STATUS, ITEM_TYPE } from "@shared/constants/mod.ts";
import { users } from "@infra/db/drizzle/schema/user.ts";
import { enumValues } from "@shared/utils/mod.ts";

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: enumValues(ITEM_TYPE) }).notNull(),
  status: text("status", { enum: enumValues(ITEM_STATUS) }).notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  content: jsonb("content").$type<ItemContent>().notNull(),
  tags: text("tags").array().notNull().default([]),
  estimatedReadTime: integer("estimated_read_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
