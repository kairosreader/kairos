import { BaseEntity, UserScoped } from "@shared/types/common/mod.ts";
import {
  BaseRepository,
  NonUserScopedRepository,
  UserScopedRepository,
} from "@core/common/base.repository.ts";
import {
  BaseError,
  BulkOperationError,
  NotFoundError,
  OperationError,
} from "@shared/types/errors/mod.ts";
import { ResourceIdentifier, UnauthorizedError } from "@shared/types/mod.ts";
import { UpdateParams } from "@shared/types/params/mod.ts";

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

    // Create a Set of found IDs for efficient lookup
    const foundIds = new Set(resources.map((resource) => resource.id));
    const missing = uniqueIds.filter((id) => !foundIds.has(id));

    return {
      found: resources,
      missing,
    };
  }

  async tryFindByIds(ids: string[]): Promise<T[]> {
    const { found, missing } = await this.findByIdsWithReport(ids);

    if (missing.length > 0) {
      throw new NotFoundError(
        this.resourceName,
        `Missing ${this.resourceName}(s): ${missing.join(", ")}`,
      );
    }

    return found;
  }

  save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }
}

export abstract class NonUserScopedService<
  T extends BaseEntity,
> extends BaseService<T> {
  constructor(protected override repository: NonUserScopedRepository<T>) {
    super(repository);
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    // Check if resource exists
    const resource = await this.tryFindById(id);
    if (!resource) {
      throw new NotFoundError(this.resourceName, id);
    }
    return this.repository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    // Check if resource exists
    const resource = await this.tryFindById(id);
    if (!resource) {
      throw new NotFoundError(this.resourceName, id);
    }
    await this.repository.delete(id);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const errors: BaseError[] = [];

    await Promise.all(
      ids.map(async (id) => {
        try {
          await this.delete(id);
        } catch (error) {
          if (error instanceof BaseError) {
            errors.push(error);
          } else {
            errors.push(new OperationError(`Unknown error`, error));
          }
        }
      }),
    );

    if (errors.length > 0) {
      throw new BulkOperationError(`Failed to delete some resources`, errors);
    }
  }
}

export abstract class UserScopedService<
  T extends BaseEntity & UserScoped,
> extends BaseService<T> {
  constructor(protected override repository: UserScopedRepository<T>) {
    super(repository);
  }

  findByUser(userId: string): Promise<T[]> {
    return this.repository.findByUser(userId);
  }

  async verifyOwnership(params: ResourceIdentifier): Promise<T> {
    const resource = await this.tryFindById(params.id);
    if (resource.userId !== params.userId) {
      throw new UnauthorizedError();
    }
    return resource;
  }

  async update(params: UpdateParams<T>): Promise<T> {
    // Check if resource exists
    const resource = await this.tryFindById(params.id);
    if (!resource) {
      throw new NotFoundError(this.resourceName, params.id);
    }
    // Verify ownership
    await this.verifyOwnership(params);
    return this.repository.update(params.id, params.updates);
  }

  async delete(params: ResourceIdentifier): Promise<void> {
    // Check if resource exists
    const resource = await this.tryFindById(params.id);
    if (!resource) {
      throw new NotFoundError(this.resourceName, params.id);
    }
    // Verify ownership
    await this.verifyOwnership(params);
    await this.repository.delete(params);
  }

  async bulkDelete(params: ResourceIdentifier[]): Promise<void> {
    const errors: BaseError[] = [];

    await Promise.all(
      params.map(async (param) => {
        try {
          await this.delete(param);
        } catch (error) {
          if (error instanceof BaseError) {
            errors.push(error);
          } else {
            errors.push(new OperationError(`Unknown error`, error));
          }
        }
      }),
    );

    if (errors.length > 0) {
      throw new BulkOperationError(`Failed to delete some resources`, errors);
    }
  }
}
