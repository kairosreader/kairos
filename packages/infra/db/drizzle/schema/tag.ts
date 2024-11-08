import { pgTable, unique, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { enumValues } from "@kairos/shared/utils";
import { TAG_COLOR } from "@kairos/shared/constants";
import { users } from "./user.ts";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
    color: text("color", { enum: enumValues(TAG_COLOR) }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    // Unique constraint to prevent duplicate tag names per user
    unique("tag_name_user_idx").on(t.name, t.userId),
  ],
);
