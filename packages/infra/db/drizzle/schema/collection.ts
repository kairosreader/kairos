import {
  pgTable,
  index,
  uniqueIndex,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm/sql";
import { users } from "./user.ts";
import { items } from "./item.ts";

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
    description: text("description"),
    isDefault: boolean("is_default").notNull().default(false),
    isArchive: boolean("is_archive").notNull().default(false),
    color: text("color"),
    icon: text("icon"),
    itemCount: integer("item_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    // Indexes for special collections for better query performance
    index("default_collection_idx")
      .on(t.userId, t.isDefault)
      .where(eq(t.isDefault, true)),
    index("archive_collection_idx")
      .on(t.userId, t.isArchive)
      .where(eq(t.isArchive, true)),
  ],
);

// Junction table for collection items (many-to-many relationship)
export const collectionItems = pgTable(
  "collection_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
    order: integer("order").notNull(),
  },
  (t) => [
    // Create indexes for better query performance
    uniqueIndex("collection_items_idx").on(t.collectionId, t.itemId),
  ],
);
