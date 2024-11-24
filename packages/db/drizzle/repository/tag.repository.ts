import { and, eq, inArray } from "drizzle-orm";
import type {
  Tag,
  TagFilterableFields,
  TagRepository,
  TagSortableFields,
} from "@kairos/core/tag";
import type {
  FindTagByNameParams,
  FindTagsByNamesParams,
} from "@kairos/shared/types/params";
import { DrizzleUserScopedRepository } from "./user-scoped.repository.ts";
import { tags } from "../schema/tag.ts";
import type { Database } from "../../connection.ts";

export class DrizzleTagRepository extends DrizzleUserScopedRepository<
  Tag,
  typeof tags._.config,
  typeof tags,
  TagSortableFields,
  TagFilterableFields
> implements TagRepository {
  constructor(db: Database) {
    super(db, tags);
  }

  async findByName(params: FindTagByNameParams): Promise<Tag | null> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.userId, params.userId),
          eq(this.table.name, params.tagName),
        ),
      )
      .limit(1);

    return result;
  }

  findByNames(params: FindTagsByNamesParams): Promise<Tag[]> {
    return this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.userId, params.userId),
          inArray(this.table.name, params.tagNames),
        ),
      );
  }

  override async save(entity: Tag): Promise<Tag> {
    const [result] = await this.db
      .insert(this.table)
      .values(entity)
      .returning();

    return result;
  }

  override saveMany(entities: Tag[]): Promise<Tag[]> {
    return this.db
      .insert(this.table)
      .values(entities)
      .returning();
  }

  override async update(id: string, updates: Partial<Tag>): Promise<Tag> {
    const [result] = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();

    return result;
  }

  updateMany(ids: string[], updates: Partial<Tag>): Promise<Tag[]> {
    return this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(this.table.id, ids))
      .returning();
  }
}
