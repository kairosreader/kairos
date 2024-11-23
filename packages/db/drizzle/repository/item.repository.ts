import { and, arrayContains, eq, inArray, sql } from "drizzle-orm";
import type {
  Item,
  ItemFilterableFields,
  ItemRepository,
  ItemSortableFields,
  ReadingProgress,
} from "@kairos/core/item";
import type { ItemType } from "@kairos/shared/constants";
import type { ItemContent, UserScoped } from "@kairos/shared/types/common";
import type { ResourceIdentifier } from "@kairos/shared/types/params";
import { DrizzleUserScopedRepository } from "./user-scoped.repository.ts";
import { items } from "../schema/item.ts";
import type { Database } from "../../connection.ts";
import {
  type DatabaseResult,
  mapArrayNullToUndefined,
  mapNullToUndefined,
} from "../../utils.ts";
import { readingProgress } from "../schema/reading.ts";

export class DrizzleItemRepository extends DrizzleUserScopedRepository<
  Item<ItemContent>,
  typeof items._.config,
  typeof items,
  ItemSortableFields,
  ItemFilterableFields
> implements ItemRepository<ItemContent> {
  constructor(db: Database) {
    super(db, items);
  }

  async findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<ItemContent>[]> {
    const whereConditions = [eq(this.table.userId, params.userId)];

    if (params.type) {
      whereConditions.push(eq(this.table.type, params.type));
    }

    const result = await this.db
      .select()
      .from(this.table)
      .where(and(...whereConditions));

    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  async findByUserAndTag(
    params: UserScoped & { tagId: string },
  ): Promise<Item<ItemContent>[]> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.userId, params.userId),
          arrayContains(this.table.tags, [params.tagId]),
        ),
      );

    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  async removeTagsFromItems(ids: string[], tagIds: string[]): Promise<void> {
    await this.db
      .update(this.table)
      .set({
        tags: sql`${this.table.tags} - array[${sql.join(tagIds)}]::text[]`,
        updatedAt: new Date(),
      })
      .where(inArray(this.table.id, ids));
  }

  override async save(entity: Item<ItemContent>): Promise<Item<ItemContent>> {
    const [result] = await this.db
      .insert(this.table)
      .values(entity)
      .returning();

    return mapNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>>,
    );
  }

  override async saveMany(
    entities: Item<ItemContent>[],
  ): Promise<Item<ItemContent>[]> {
    const result = await this.db
      .insert(this.table)
      .values(entities)
      .returning();

    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  override async update(
    id: string,
    updates: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>> {
    const [result] = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();

    return mapNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>>,
    );
  }

  async updateMany(
    ids: string[],
    updates: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>[]> {
    const result = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(this.table.id, ids))
      .returning();

    return mapArrayNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>[]>,
    );
  }

  async updateReadingProgress(
    id: string,
    progress: ReadingProgress,
  ): Promise<void> {
    await this.db
      .update(readingProgress)
      .set({
        lastPosition: progress.lastPosition,
        lastReadAt: progress.lastReadAt,
        progress: progress.progress,
        updatedAt: new Date(),
      })
      .where(eq(this.table.id, id));
  }
}
