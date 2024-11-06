import { BaseEntity } from "@shared/types/common/mod.ts";
import { UserScopedParams } from "@shared/types/params/mod.ts";

export interface BaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
}

export interface NonUserScopedRepository<T extends BaseEntity>
  extends BaseRepository<T> {
  delete(id: string): Promise<void>;
}

export interface UserScopedRepository<T extends BaseEntity>
  extends BaseRepository<T> {
  findByUser(userId: string): Promise<T[]>;
  delete(params: UserScopedParams): Promise<void>;
}
