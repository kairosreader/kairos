import type {
  BaseEntity,
  FilterConfig,
  PaginatedResponse,
  QueryOptions,
  ResourceIdentifier,
} from "@kairos/shared";

export interface BaseRepository<
  T extends BaseEntity,
  TSortable extends string = string,
  TFilterable extends string = string,
> {
  find(
    options: QueryOptions<TSortable, TFilterable>,
  ): Promise<PaginatedResponse<T>>;
  findByIds(ids: string[]): Promise<T[]>;
  save(entity: T): Promise<T>;
  saveMany(entities: T[]): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<T>;
  updateMany(ids: string[], updates: Partial<T>): Promise<T[]>;
}

export interface NonUserScopedRepository<
  T extends BaseEntity,
  TSortable extends string,
  TFilterable extends string,
> extends BaseRepository<T, TSortable, TFilterable> {
  findById(id: string): Promise<T | null>;
  delete(id: string): Promise<void>;
  count(filter?: FilterConfig<TFilterable>): Promise<number>;
}

export interface UserScopedRepository<
  T extends BaseEntity,
  TSortable extends string,
  TFilterable extends string,
> extends BaseRepository<T, TSortable, TFilterable> {
  findById(params: ResourceIdentifier): Promise<T | null>;
  findByUser(
    userId: string,
    options?: QueryOptions<TSortable, TFilterable>,
  ): Promise<PaginatedResponse<T>>;
  delete(params: ResourceIdentifier): Promise<void>;
  count(userId: string, filter?: FilterConfig<TFilterable>): Promise<number>;
}
