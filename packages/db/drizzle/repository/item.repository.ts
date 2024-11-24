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
import { readingProgress } from "../schema/reading.ts";
import { ReadingProgressUtils } from "../utils/reading-progress.utils.ts";

export class DrizzleItemRepository extends DrizzleUserScopedRepository<
  Item<ItemContent>,
  typeof items._.config,
  typeof items,
  ItemSortableFields,
  ItemFilterableFields
> implements ItemRepository<ItemContent> {
  private readonly progressUtils: ReadingProgressUtils;

  constructor(db: Database) {
    super(db, items);
    this.progressUtils = new ReadingProgressUtils(db);
  }

  async findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<ItemContent>[]> {
    const whereConditions = [
      eq(this.table.userId, params.userId),
      ...(params.type ? [eq(this.table.type, params.type)] : []),
    ];

    const results = await this.db
      .select({
        item: this.table,
        progress: readingProgress,
      })
      .from(this.table)
      .leftJoin(readingProgress, this.progressUtils.buildProgressJoin().on)
      .where(and(...whereConditions));

    return results.map(({ item, progress }) => ({
      ...item,
      progress: this.progressUtils.mapReadingProgressToProgress(progress),
    }));
  }

  async findByUserAndTag(
    params: UserScoped & { tagId: string },
  ): Promise<Item<ItemContent>[]> {
    const results = await this.db
      .select({
        item: this.table,
        progress: readingProgress,
      })
      .from(this.table)
      .leftJoin(readingProgress, this.progressUtils.buildProgressJoin().on)
      .where(
        and(
          eq(this.table.userId, params.userId),
          arrayContains(this.table.tags, [params.tagId]),
        ),
      );

    return results.map(({ item, progress }) => ({
      ...item,
      progress: this.progressUtils.mapReadingProgressToProgress(progress),
    }));
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
    const { progress, ...itemData } = entity;

    const [result] = await this.db
      .insert(this.table)
      .values(itemData)
      .returning();

    return {
      ...result,
      progress,
    };
  }

  override async saveMany(
    entities: Item<ItemContent>[],
  ): Promise<Item<ItemContent>[]> {
    // Omit progress from the data to be inserted
    const itemsToInsert = entities.map(({ progress: _, ...entity }) => entity);

    const results = await this.db
      .insert(this.table)
      .values(itemsToInsert)
      .returning();

    return results.map((result, index) => ({
      ...result,
      progress: entities[index].progress,
    }));
  }

  override async update(
    id: string,
    { progress, ...updates }: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>> {
    const [result] = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();

    if (progress) {
      await this.progressUtils.updateItemProgress(id, result.userId, progress);
    }

    const [itemWithProgress] = await this.progressUtils.getItemsWithProgress([
      id,
    ]);
    return {
      ...itemWithProgress.item,
      progress: this.progressUtils.mapReadingProgressToProgress(
        itemWithProgress.progress,
      ),
    };
  }

  async updateMany(
    ids: string[],
    { progress, ...updates }: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>[]> {
    const results = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(this.table.id, ids))
      .returning();

    if (progress) {
      await Promise.all(
        results.map((item) =>
          this.progressUtils.updateItemProgress(item.id, item.userId, progress)
        ),
      );
    }

    const itemsWithProgress = await this.progressUtils.getItemsWithProgress(
      ids,
    );
    return itemsWithProgress.map(({ item, progress }) => ({
      ...item,
      progress: this.progressUtils.mapReadingProgressToProgress(progress),
    }));
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
