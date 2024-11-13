import { eq, and, inArray } from "drizzle-orm";
import type { Tag, TagRepository } from "@kairos/core";
import type {
  FindTagByNameParams,
  ResourceIdentifier,
} from "@kairos/shared/types/params";
import { db } from "../../db/connection.ts";
import { tags } from "../../db/drizzle/schema/tag.ts";
import { mapArrayNullToUndefined, mapNullToUndefined } from "../../db/utils.ts";

export class DrizzleTagRepository implements TagRepository {
  async findById(id: string): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

    if (result.length === 0) return null;
    return mapNullToUndefined<Tag>(result[0]);
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    const result = await db.select().from(tags).where(inArray(tags.id, ids));
    return mapArrayNullToUndefined<Tag>(result);
  }

  async findByUser(userId: string): Promise<Tag[]> {
    const result = await db.select().from(tags).where(eq(tags.userId, userId));
    return mapArrayNullToUndefined<Tag>(result);
  }

  async findByName(params: FindTagByNameParams): Promise<Tag | null> {
    const result = await db
      .select()
      .from(tags)
      .where(and(eq(tags.name, params.tagName), eq(tags.userId, params.userId)))
      .limit(1);

    if (result.length === 0) return null;
    return mapNullToUndefined<Tag>(result[0]);
  }

  async save(entity: Tag): Promise<Tag> {
    const [result] = await db.insert(tags).values(entity).returning();
    return mapNullToUndefined<Tag>(result);
  }

  async update(id: string, updates: Partial<Tag>): Promise<Tag> {
    const [result] = await db
      .update(tags)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning();
    return mapNullToUndefined<Tag>(result);
  }

  async delete(params: ResourceIdentifier): Promise<void> {
    await db
      .delete(tags)
      .where(and(eq(tags.id, params.id), eq(tags.userId, params.userId)));
  }
}
