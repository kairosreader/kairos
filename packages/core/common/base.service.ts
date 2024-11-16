import type { BaseEntity, UserScoped } from "@kairos/shared/types/common";
import type {
  PaginatedResponse,
  QueryOptions,
  ResourceIdentifier,
  UpdateParams,
} from "@kairos/shared/types";
import {
  BulkOperationError,
  NotFoundError,
  OperationError,
  UnauthorizedError,
} from "@kairos/shared/types/errors";
import type {
  BaseRepository,
  NonUserScopedRepository,
  UserScopedRepository,
} from "./base.repository.ts";

interface FindByIdsResult<T> {
  found: T[];
  missing: string[];
}

export abstract class BaseService<T extends BaseEntity> {
  protected abstract resourceName: string;

  constructor(protected repository: BaseRepository<T>) {}

  findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  findByIds(ids: string[]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  async tryFindById(id: string): Promise<T> {
    const resource = await this.repository.findById(id);
    if (!resource) {
      throw new NotFoundError(this.resourceName, id);
    }
    return resource;
  }

  async findByIdsWithReport(ids: string[]): Promise<FindByIdsResult<T>> {
    if (!ids.length) {
      return { found: [], missing: [] };
    }

    const uniqueIds = [...new Set(ids)];
    const resources = await this.repository.findByIds(uniqueIds);

    const foundIds = new Set(resources.map((r) => r.id));
    const missing = uniqueIds.filter((id) => !foundIds.has(id));

    return {
      found: resources,
      missing,
    };
  }

  async save(entity: T): Promise<T> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }
}

export abstract class NonUserScopedService<
  T extends BaseEntity,
> extends BaseService<T> {
  constructor(protected override repository: NonUserScopedRepository<T>) {
    super(repository);
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    await this.tryFindById(id);
    try {
      return await this.repository.save({ id, ...updates } as T);
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }

  async delete(id: string): Promise<void> {
    await this.tryFindById(id);
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const { missing } = await this.findByIdsWithReport(ids);
    if (missing.length) {
      throw new BulkOperationError(
        this.resourceName,
        missing.map((id) => new NotFoundError(this.resourceName, id)),
      );
    }

    try {
      await Promise.all(ids.map((id) => this.repository.delete(id)));
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }
}

export abstract class UserScopedService<
  T extends BaseEntity & UserScoped,
  TSortable extends string = string,
  TFilterable extends string = string,
> extends BaseService<T> {
  constructor(
    protected override repository: UserScopedRepository<
      T,
      TSortable,
      TFilterable
    >,
  ) {
    super(repository);
  }

  findByUser(
    userId: string,
    options?: QueryOptions<TSortable, TFilterable>,
  ): Promise<PaginatedResponse<T>> {
    return this.repository.findByUser(userId, options);
  }

  async verifyOwnership(params: ResourceIdentifier): Promise<T> {
    const resource = await this.tryFindById(params.id);
    if (resource.userId !== params.userId) {
      throw new UnauthorizedError(
        `You don't have permission to access this ${this.resourceName.toLowerCase()}`,
      );
    }
    return resource;
  }

  async update(params: UpdateParams<T>): Promise<T> {
    await this.verifyOwnership(params);
    try {
      return await this.repository.save({
        id: params.id,
        ...params.updates,
      } as T);
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }

  async delete(params: ResourceIdentifier): Promise<void> {
    await this.verifyOwnership(params);
    try {
      await this.repository.delete(params);
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }

  async bulkDelete(params: ResourceIdentifier[]): Promise<void> {
    await Promise.all(params.map((param) => this.verifyOwnership(param)));
    try {
      await Promise.all(params.map((param) => this.repository.delete(param)));
    } catch (error) {
      throw new OperationError(this.resourceName, error);
    }
  }
}
