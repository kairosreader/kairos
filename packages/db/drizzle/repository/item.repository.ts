import { and, eq, inArray } from "drizzle-orm";
import type { Item, ItemRepository, ReadingProgress } from "@kairos/core/item";
import type { ItemType } from "@kairos/shared/constants";
import type { ItemContent, UserScoped } from "@kairos/shared/types/common";
import type { ResourceIdentifier } from "@kairos/shared/types/params";
import { DrizzleUserScopedRepository } from "./user-scoped.repository.ts";
import { items } from "../schema/item.ts";
import { readingProgress } from "../schema/reading.ts";
import { itemTags } from "../schema/item-tag.ts";
import { tags } from "../schema/tag.ts";
import type { ItemTag } from "@kairos/shared/types/common";
import type { Database } from "../../connection.ts";
import { BulkOperationError, NotFoundError } from "@kairos/shared";

export class DrizzleItemRepository extends DrizzleUserScopedRepository<
  Item<ItemContent>,
  typeof items._.config,
  typeof items
> implements ItemRepository<ItemContent> {
  constructor(db: Database) {
    super(db, items);
  }

  override async save(entity: Item<ItemContent>): Promise<Item<ItemContent>> {
    const { progress, tags, ...itemData } = entity;

    const [result] = await this.db.insert(items).values(itemData).returning();

    if (tags?.length) {
      await this.addTagsToItem(result.id, tags);
    }

    if (progress) {
      await this.updateReadingProgress(result.id, {
        itemId: result.id,
        userId: result.userId,
        progress: progress.progress,
        lastPosition: progress.lastPosition,
        lastReadAt: new Date(),
      });
    }

    return {
      ...result,
      progress,
      tags: tags ?? [],
    };
  }

  override async saveMany(
    entities: Item<ItemContent>[],
  ): Promise<Item<ItemContent>[]> {
    const results = await Promise.all(
      entities.map((entity) => this.save(entity)),
    );
    return results;
  }

  override async update(
    id: string,
    { progress, tags, ...updates }: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>> {
    const [result] = await this.db
      .update(items)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();

    if (tags) {
      await this.replaceTags(id, tags);
    }

    if (progress) {
      await this.updateReadingProgress(id, {
        itemId: id,
        userId: result.userId,
        progress: progress.progress,
        lastPosition: progress.lastPosition,
        lastReadAt: new Date(),
      });
    }

    const updatedItem = await this.findById({
      id,
      userId: result.userId,
    });

    if (!updatedItem) {
      throw new NotFoundError("Item", id);
    }

    return updatedItem;
  }

  override async updateMany(
    ids: string[],
    { progress, tags, ...updates }: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>[]> {
    const results = await this.db
      .update(items)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(items.id, ids))
      .returning();

    if (tags) {
      await this.bulkReplaceTags(ids, tags);
    }

    if (progress) {
      await Promise.all(
        results.map((item) =>
          this.updateReadingProgress(item.id, {
            itemId: item.id,
            userId: item.userId,
            progress: progress.progress,
            lastPosition: progress.lastPosition,
            lastReadAt: new Date(),
          })
        ),
      );
    }

    const updatedItems = await Promise.all(
      results.map((item) =>
        this.findById({ id: item.id, userId: item.userId })
      ),
    );

    // Filter out any null results and throw if any items weren't found
    const filteredItems = updatedItems.filter(
      (item): item is Item<ItemContent> => item !== null,
    );
    if (filteredItems.length !== results.length) {
      throw new BulkOperationError(
        "Items not found after update",
        ids
          .filter((id) => !results.some((item) => item.id === id))
          .map((id) => new NotFoundError("Item", id)),
      );
    }

    return filteredItems;
  }

  async findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<ItemContent>[]> {
    const result = await this.db.query.items.findMany({
      where: and(
        eq(items.userId, params.userId),
        params.type ? eq(items.type, params.type) : undefined,
      ),
      with: {
        readingProgress: {
          where: eq(readingProgress.userId, params.userId),
        },
        itemTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return result.map((item) => ({
      ...item,
      progress: item.readingProgress?.[0] ?? null,
      tags: item.itemTags.map((it) => it.tag),
    }));
  }

  async findByUserAndTag({
    userId,
    tagId,
  }: UserScoped & { tagId: string }): Promise<Item<ItemContent>[]> {
    const result = await this.db.query.items.findMany({
      where: eq(items.userId, userId),
      with: {
        itemTags: {
          where: eq(itemTags.tagId, tagId),
          with: {
            tag: true,
          },
        },
        readingProgress: {
          where: eq(readingProgress.userId, userId),
        },
      },
    });

    return result
      .filter((item) => item.itemTags.length > 0)
      .map((item) => ({
        ...item,
        progress: item.readingProgress?.[0] ?? null,
        tags: item.itemTags.map((it) => it.tag),
      }));
  }

  async removeTagsFromItems(
    itemIds: string[],
    tagIds: string[],
  ): Promise<void> {
    await this.db
      .delete(itemTags)
      .where(
        and(inArray(itemTags.itemId, itemIds), inArray(itemTags.tagId, tagIds)),
      );
  }

  async addTagsToItem(itemId: string, tags: ItemTag[]): Promise<void> {
    const values = tags.map((tag) => ({
      itemId,
      tagId: tag.id,
    }));

    await this.db.insert(itemTags).values(values).onConflictDoNothing();
  }

  async updateTagInfo(
    tagId: string,
    updates: Partial<Omit<ItemTag, "id">>,
  ): Promise<void> {
    await this.db
      .update(tags)
      .set({
        name: updates.name,
        color: updates.color,
        updatedAt: new Date(),
      })
      .where(eq(tags.id, tagId));
  }

  async replaceTags(itemId: string, newTags: ItemTag[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      // Delete all existing tags
      await tx.delete(itemTags).where(eq(itemTags.itemId, itemId));

      // Add new tags
      if (newTags.length > 0) {
        await tx.insert(itemTags).values(
          newTags.map((tag) => ({
            itemId,
            tagId: tag.id,
          })),
        );
      }
    });
  }

  async bulkReplaceTags(itemIds: string[], newTags: ItemTag[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      // Delete all existing tags
      await tx.delete(itemTags).where(inArray(itemTags.itemId, itemIds));

      // Add new tags
      if (newTags.length > 0) {
        await tx.insert(itemTags).values(
          itemIds.flatMap((itemId) =>
            newTags.map((tag) => ({
              itemId,
              tagId: tag.id,
            }))
          ),
        );
      }
    });
  }

  async updateReadingProgress(
    id: string,
    progress: ReadingProgress,
  ): Promise<void> {
    await this.db
      .insert(readingProgress)
      .values({
        itemId: id,
        userId: progress.userId,
        progress: progress.progress,
        lastPosition: progress.lastPosition,
        lastReadAt: progress.lastReadAt,
      })
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

  override async findById(
    params: ResourceIdentifier,
  ): Promise<Item<ItemContent> | null> {
    const result = await this.db.query.items.findFirst({
      where: and(eq(items.id, params.id), eq(items.userId, params.userId)),
      with: {
        readingProgress: {
          where: eq(readingProgress.userId, params.userId),
        },
        itemTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!result) return null;

    return {
      ...result,
      progress: result.readingProgress?.[0] ?? null,
      tags: result.itemTags.map((it) => it.tag),
    };
  }
}
