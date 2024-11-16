import type {
  BaseEntity,
  PaginatedResponse,
  QueryOptions,
  ResourceIdentifier,
} from "@kairos/shared";

export interface BaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findByIds(ids: string[]): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
}

export interface NonUserScopedRepository<T extends BaseEntity>
  extends BaseRepository<T> {
  delete(id: string): Promise<void>;
}

export interface UserScopedRepository<
  T extends BaseEntity,
  TSortable extends string,
  TFilterable extends string,
> extends BaseRepository<T> {
  findByUser(
    userId: string,
    options?: QueryOptions<TSortable, TFilterable>,
  ): Promise<PaginatedResponse<T>>;
  delete(params: ResourceIdentifier): Promise<void>;
}
