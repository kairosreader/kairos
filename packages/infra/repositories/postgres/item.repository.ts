import { eq, and, inArray } from "drizzle-orm";
import { db } from "@infra/db/connection.ts";
import { items } from "@infra/db/drizzle/schema/item.ts";
import { readingProgress } from "@infra/db/drizzle/schema/reading.ts";
import { Item, ItemRepository, ReadingProgress } from "@core/item/mod.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { ItemType } from "@shared/constants/mod.ts";
import { ResourceIdentifier } from "@shared/types/params/mod.ts";
import {
  mapNullToUndefined,
  mapArrayNullToUndefined,
} from "@infra/db/utils.ts";
import { DatabaseResult } from "@infra/db/utils.ts";

export class DrizzleItemRepository implements ItemRepository<ItemContent> {
  async findById(id: string): Promise<Item<ItemContent> | null> {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);

    if (result.length === 0) return null;
    return mapNullToUndefined<Item<ItemContent>>(
      result[0] as DatabaseResult<Item<ItemContent>>,
    );
  }

  async findByIds(ids: string[]): Promise<Item<ItemContent>[]> {
    const result = await db.select().from(items).where(inArray(items.id, ids));
    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  async findByUser(userId: string): Promise<Item<ItemContent>[]> {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.userId, userId));
    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  async findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<ItemContent>[]> {
    const result = await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.userId, params.userId),
          eq(items.type, params.type!).if(params.type !== undefined),
        ),
      );

    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  async save(entity: Item<ItemContent>): Promise<Item<ItemContent>> {
    const [result] = await db.insert(items).values(entity).returning();
    return mapNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>>,
    );
  }

  async update(
    id: string,
    updates: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>> {
    const [result] = await db
      .update(items)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();

    return mapNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>>,
    );
  }

  async delete(params: ResourceIdentifier): Promise<void> {
    await db
      .delete(items)
      .where(and(eq(items.id, params.id), eq(items.userId, params.userId)));
  }

  async updateReadingProgress(progress: ReadingProgress): Promise<void> {
    await db
      .insert(readingProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [readingProgress.itemId, readingProgress.userId],
        set: {
          progress: progress.progress,
          lastPosition: progress.lastPosition,
          lastReadAt: progress.lastReadAt,
          updatedAt: new Date(),
        },
      });
  }
}
