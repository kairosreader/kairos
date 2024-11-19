import { and, eq, inArray, sql } from "drizzle-orm";
import type { Collection, CollectionRepository } from "@kairos/core/collection";
import type { Item } from "@kairos/core/item";
import type {
  AddToCollectionParams,
  RemoveFromCollectionParams,
} from "@kairos/shared/types/params";
import { DrizzleUserScopedRepository } from "./user-scoped.repository.ts";
import { collectionItems, collections } from "../schema/collection.ts";
import { items } from "../schema/item.ts";
import type { Database } from "../../connection.ts";
import {
  type DatabaseResult,
  mapArrayNullToUndefined,
  mapNullToUndefined,
} from "../../utils.ts";
import type { ItemContent } from "@kairos/shared/types/common";

export class DrizzleCollectionRepository
  extends DrizzleUserScopedRepository<
    Collection,
    typeof collections._.config,
    typeof collections
  >
  implements CollectionRepository
{
  constructor(db: Database) {
    super(db, collections);
  }

  async findByItem(itemId: string): Promise<Collection[]> {
    const result = await this.db
      .select(collections._.columns)
      .from(collections)
      .innerJoin(
        collectionItems,
        eq(collections.id, collectionItems.collectionId),
      )
      .where(eq(collectionItems.itemId, itemId));

    return mapArrayNullToUndefined<Collection>(
      result as DatabaseResult<Collection[]>,
    );
  }

  async findDefault(userId: string): Promise<Collection | null> {
    const result = await this.findOne({
      userId: { eq: userId },
      isDefault: { eq: true },
    });

    if (!result) return null;

    return mapNullToUndefined<Collection>(result);
  }

  async findArchive(userId: string): Promise<Collection | null> {
    const result = await this.findOne({
      userId: { eq: userId },
      isArchive: { eq: true },
    });

    if (!result) return null;

    return mapNullToUndefined<Collection>(result);
  }

  async addItem(params: AddToCollectionParams): Promise<void> {
    await this.db.insert(collectionItems).values({
      collectionId: params.id,
      itemId: params.itemInfo.itemId,
    });

    // Update item count
    await this.db
      .update(collections)
      .set({
        itemCount: sql`${collections.itemCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, params.id));
  }

  async removeItem(params: RemoveFromCollectionParams): Promise<void> {
    await this.db
      .delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, params.id),
          eq(collectionItems.itemId, params.itemInfo.itemId),
        ),
      );

    // Update item count
    await this.db
      .update(collections)
      .set({
        itemCount: sql`${collections.itemCount} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, params.id));
  }

  async getItems(collectionId: string): Promise<Item<ItemContent>[]> {
    const result = await this.db
      .select(items._.columns)
      .from(items)
      .innerJoin(collectionItems, eq(items.id, collectionItems.itemId))
      .where(eq(collectionItems.collectionId, collectionId));

    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  override async save(entity: Collection): Promise<Collection> {
    const [result] = await this.db
      .insert(collections)
      .values(entity)
      .returning();

    return mapNullToUndefined<Collection>(result as DatabaseResult<Collection>);
  }

  override async saveMany(entities: Collection[]): Promise<Collection[]> {
    const result = await this.db
      .insert(collections)
      .values(entities)
      .returning();

    return mapArrayNullToUndefined<Collection>(
      result as DatabaseResult<Collection[]>,
    );
  }

  override async update(
    id: string,
    updates: Partial<Collection>,
  ): Promise<Collection> {
    const [result] = await this.db
      .update(collections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(collections.id, id))
      .returning();

    return mapNullToUndefined<Collection>(result as DatabaseResult<Collection>);
  }

  async updateMany(
    ids: string[],
    updates: Partial<Collection>,
  ): Promise<Collection[]> {
    const result = await this.db
      .update(collections)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(collections.id, ids))
      .returning();

    return mapArrayNullToUndefined<Collection>(
      result as DatabaseResult<Collection[]>,
    );
  }
}
