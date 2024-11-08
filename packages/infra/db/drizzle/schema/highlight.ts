import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { HIGHLIGHT_COLOR } from "@shared/constants/mod.ts";
import { items } from "@infra/db/drizzle/schema/item.ts";
import { users } from "@infra/db/drizzle/schema/user.ts";
import { enumValues } from "@shared/utils/mod.ts";

export const highlights = pgTable("highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  color: text("color", { enum: enumValues(HIGHLIGHT_COLOR) }).notNull(),
  textSelection: jsonb("text_selection").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
