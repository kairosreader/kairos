import { and, eq } from "drizzle-orm";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
  ItemRepository,
  ReadingProgress,
} from "@kairos/core/item";
import type { ItemType } from "@kairos/shared/constants";
import type { ItemContent } from "@kairos/shared/types/common";
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

export class DrizzleItemRepository
  extends DrizzleUserScopedRepository<
    Item<ItemContent>,
    typeof items._.config,
    typeof items,
    ItemSortableFields,
    ItemFilterableFields
  >
  implements ItemRepository<ItemContent>
{
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

  override async save(entity: Item<ItemContent>): Promise<Item<ItemContent>> {
    const [result] = await this.db
      .insert(this.table)
      .values(entity)
      .returning();

    return mapNullToUndefined<Item<ItemContent>>(
      result as DatabaseResult<Item<ItemContent>>,
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
