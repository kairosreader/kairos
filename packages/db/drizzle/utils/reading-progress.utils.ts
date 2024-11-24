import { and, eq, inArray } from "drizzle-orm";
import { readingProgress } from "../schema/reading.ts";
import type { Database } from "../../connection.ts";
import type { Item, ItemProgress } from "@kairos/core/item";
import { items } from "../schema/item.ts";
import type { ItemContent } from "@kairos/shared";

export class ReadingProgressUtils {
  constructor(private readonly db: Database) {}

  buildProgressJoin() {
    return {
      on: and(
        eq(readingProgress.itemId, items.id),
        eq(readingProgress.userId, items.userId),
      ),
      table: readingProgress,
    };
  }

  async getItemsWithProgress(
    ids: string[],
  ): Promise<
    Array<{
      item: Item<ItemContent>;
      progress: typeof readingProgress.$inferSelect | null;
    }>
  > {
    console.log("Getting reading progress for items:", ids);

    const results = await this.db
      .select({
        item: items,
        progress: readingProgress,
      })
      .from(items)
      .leftJoin(readingProgress, this.buildProgressJoin().on)
      .where(inArray(items.id, ids));

    console.log(
      "Items with progress results:",
      JSON.stringify(results, null, 2),
    );

    return results.map((row) => ({
      item: row.item as Item<ItemContent>,
      progress: row.progress,
    }));
  }

  mapReadingProgressToProgress(
    progress: typeof readingProgress.$inferSelect | null,
  ): ItemProgress | null {
    if (!progress) return null;
    return {
      progress: progress.progress,
      lastPosition: progress.lastPosition,
    };
  }

  async updateItemProgress(
    itemId: string,
    userId: string,
    progress: ItemProgress,
  ): Promise<void> {
    await this.db
      .insert(readingProgress)
      .values({
        itemId,
        userId,
        progress: progress.progress,
        lastPosition: progress.lastPosition,
        lastReadAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [readingProgress.itemId, readingProgress.userId],
        set: {
          progress: progress.progress,
          lastPosition: progress.lastPosition,
          lastReadAt: new Date(),
        },
      });
  }
}
