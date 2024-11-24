import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { enumValuesTuple } from "@kairos/shared/utils";
import { HIGHLIGHT_COLOR } from "@kairos/shared/constants";
import type { Highlight } from "@kairos/core/highlight";
import { items } from "./item.ts";
import { users } from "./user.ts";

export const highlights = pgTable("highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  color: text("color", { enum: enumValuesTuple(HIGHLIGHT_COLOR) }).notNull(),
  textSelection: jsonb("text_selection").$type<Highlight["textSelection"]>()
    .notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
