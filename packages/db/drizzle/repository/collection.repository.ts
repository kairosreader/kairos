import { and, eq, inArray, sql } from "drizzle-orm";
import type { Collection, CollectionRepository } from "@kairos/core/collection";
import type { Item } from "@kairos/core/item";
import type {
  AddToCollectionParams,
  RemoveFromCollectionParams,
} from "@kairos/shared/types/params";
import { DrizzleUserScopedRepository } from "./user-scoped.repository.ts";
import { collectionItems, collections } from "../schema/collection.ts";
import type { Database } from "../../connection.ts";
import type { ItemContent } from "@kairos/shared/types/common";

export class DrizzleCollectionRepository extends DrizzleUserScopedRepository<
  Collection,
  typeof collections._.config,
  typeof collections
> implements CollectionRepository {
  constructor(db: Database) {
    super(db, collections);
  }

  findByItem(itemId: string): Promise<Collection[]> {
    return this.db
      .select(collections._.columns)
      .from(collections)
      .innerJoin(
        collectionItems,
        eq(collections.id, collectionItems.collectionId),
      )
      .where(eq(collectionItems.itemId, itemId));
  }

  findDefault(userId: string): Promise<Collection | null> {
    return this.findOne({
      userId: { eq: userId },
      isDefault: { eq: true },
    });
  }

  findArchive(userId: string): Promise<Collection | null> {
    return this.findOne({
      userId: { eq: userId },
      isArchive: { eq: true },
    });
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
    const results = await this.db.query.items.findMany({
      with: {
        readingProgress: true,
        itemTags: {
          with: {
            tag: true,
          },
        },
      },
      where: eq(collectionItems.collectionId, collectionId),
    });

    return results.map((result) => ({
      ...result,
      progress: result.readingProgress?.[0] ?? null,
      tags: result.itemTags.map((it) => it.tag),
    }));
  }

  override async save(entity: Collection): Promise<Collection> {
    const [result] = await this.db
      .insert(collections)
      .values(entity)
      .returning();

    return result;
  }

  override saveMany(entities: Collection[]): Promise<Collection[]> {
    return this.db.insert(collections).values(entities).returning();
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

    return result;
  }

  updateMany(
    ids: string[],
    updates: Partial<Collection>,
  ): Promise<Collection[]> {
    return this.db
      .update(collections)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(collections.id, ids))
      .returning();
  }
}
