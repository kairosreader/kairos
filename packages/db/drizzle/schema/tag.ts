import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { enumValuesTuple } from "@kairos/shared/utils";
import { TAG_COLOR } from "@kairos/shared/constants";
import { users } from "./user.ts";
import { relations } from "drizzle-orm";
import { itemTags } from "./item-tag.ts";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color", { enum: enumValuesTuple(TAG_COLOR) }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    // Unique constraint to prevent duplicate tag names per user
    unique("tag_name_user_idx").on(t.name, t.userId),
  ],
);

export const tagsRelations = relations(tags, ({ many }) => ({
  itemTags: many(itemTags),
}));
