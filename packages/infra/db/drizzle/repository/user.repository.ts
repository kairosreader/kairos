import { eq, inArray } from "drizzle-orm";
import type {
  User,
  UserFilterableFields,
  UserRepository,
  UserSortableFields,
} from "@kairos/core";
import { DrizzleNonUserScopedRepository } from "./non-user-scoped.repository.ts";
import { users } from "../schema/user.ts";
import type { Database } from "../../connection.ts";

export class DrizzleUserRepository extends DrizzleNonUserScopedRepository<
  User,
  typeof users._.config,
  typeof users,
  UserFilterableFields,
  UserSortableFields
> implements UserRepository {
  constructor(db: Database) {
    super(db, users);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email: { eq: email } });
  }

  override async save(entity: User): Promise<User> {
    const [result] = await this.db.insert(users).values(entity).returning();
    return result;
  }

  override saveMany(entities: User[]): Promise<User[]> {
    const result = this.db.insert(users).values(entities).returning();
    return result;
  }

  override async update(id: string, updates: Partial<User>): Promise<User> {
    const [result] = await this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return result;
  }

  override updateMany(ids: string[], updates: Partial<User>): Promise<User[]> {
    return this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(users.id, ids))
      .returning();
  }
}
