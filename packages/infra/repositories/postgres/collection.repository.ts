// packages/infra/repositories/postgres/collection.repository.ts
import { and, eq, inArray, sql } from "drizzle-orm";
import type { Collection, CollectionRepository } from "@kairos/core/collection";
import type {
  AddToCollectionParams,
  RemoveFromCollectionParams,
  ResourceIdentifier,
} from "@kairos/shared/types/params";
import { db } from "../../db/connection.ts";
import {
  collectionItems,
  collections,
  items,
} from "../../db/drizzle/schema/mod.ts";
import {
  type DatabaseResult,
  mapArrayNullToUndefined,
  mapNullToUndefined,
} from "../../db/utils.ts";
import type { Item } from "@kairos/core/item";

export class DrizzleCollectionRepository implements CollectionRepository {
  async findById(id: string): Promise<Collection | null> {
    const result = await db
      .select()
      .from(collections)
      .where(eq(collections.id, id))
      .limit(1);

    if (result.length === 0) return null;
    return mapNullToUndefined<Collection>(result[0]);
  }

  async findByIds(ids: string[]): Promise<Collection[]> {
    const result = await db
      .select()
      .from(collections)
      .where(inArray(collections.id, ids));
    return mapArrayNullToUndefined<Collection>(result);
  }

  async findByUser(userId: string): Promise<Collection[]> {
    const result = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, userId));
    return mapArrayNullToUndefined<Collection>(result);
  }

  async save(entity: Collection): Promise<Collection> {
    const [result] = await db.insert(collections).values(entity).returning();
    return mapNullToUndefined<Collection>(result);
  }

  async update(id: string, updates: Partial<Collection>): Promise<Collection> {
    const [result] = await db
      .update(collections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(collections.id, id))
      .returning();
    return mapNullToUndefined<Collection>(result);
  }

  async delete(params: ResourceIdentifier): Promise<void> {
    await db
      .delete(collections)
      .where(
        and(
          eq(collections.id, params.id),
          eq(collections.userId, params.userId),
        ),
      );
  }

  async findByItem(itemId: string): Promise<Collection[]> {
    const result = await db
      .select({
        collection: collections,
      })
      .from(collectionItems)
      .innerJoin(collections, eq(collections.id, collectionItems.collectionId))
      .where(eq(collectionItems.itemId, itemId));

    return mapArrayNullToUndefined<Collection>(result.map((r) => r.collection));
  }

  async findDefault(userId: string): Promise<Collection> {
    const [result] = await db
      .select()
      .from(collections)
      .where(
        and(eq(collections.userId, userId), eq(collections.isDefault, true)),
      )
      .limit(1);

    if (!result) {
      throw new Error("Default collection not found");
    }

    return mapNullToUndefined<Collection>(result);
  }

  async findArchive(userId: string): Promise<Collection> {
    const [result] = await db
      .select()
      .from(collections)
      .where(
        and(eq(collections.userId, userId), eq(collections.isArchive, true)),
      )
      .limit(1);

    if (!result) {
      throw new Error("Archive collection not found");
    }

    return mapNullToUndefined<Collection>(result);
  }

  async addItem(params: AddToCollectionParams): Promise<void> {
    // Get the current highest order number for the collection
    const maxOrderResult = await db
      .select({ maxOrder: sql<number>`MAX(${collectionItems.order})` })
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, params.id))
      .limit(1);

    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    // Add the item
    await db.insert(collectionItems).values({
      id: crypto.randomUUID(),
      collectionId: params.id,
      itemId: params.itemInfo.itemId,
      order: nextOrder,
    });

    // Update the collection's item count
    await db
      .update(collections)
      .set({
        itemCount: sql`${collections.itemCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, params.id));
  }

  async removeItem(params: RemoveFromCollectionParams): Promise<void> {
    await db
      .delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, params.id),
          eq(collectionItems.itemId, params.itemInfo.itemId),
        ),
      );

    // Update the collection's item count
    await db
      .update(collections)
      .set({
        itemCount: sql`${collections.itemCount} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, params.id));
  }

  async getItems(collectionId: string): Promise<Item[]> {
    const result = await db
      .select({
        item: items,
      })
      .from(collectionItems)
      .innerJoin(items, eq(items.id, collectionItems.itemId))
      .where(eq(collectionItems.collectionId, collectionId))
      .orderBy(collectionItems.order);

    return mapArrayNullToUndefined<Item>(
      result.map((r) => r.item) as DatabaseResult<Item>[],
    );
  }
}
