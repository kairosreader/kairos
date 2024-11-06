import { BaseError } from "@shared/types/errors/base.error.ts";

export class NotFoundError extends BaseError {
  status = 404;
  constructor(resourceName: string, id: string) {
    super(`${resourceName} not found: ${id}`, "NOT_FOUND");
  }
}

export class DuplicateError extends BaseError {
  status = 409;
  constructor(message: string) {
    super(message, "DUPLICATE");
  }
}

export class OperationError extends BaseError {
  status = 500;
  constructor(message: string, details?: unknown) {
    super(message, "OPERATION_FAILED", details);
  }
}

export class BulkOperationError extends OperationError {
  constructor(
    message: string,
    public readonly errors: BaseError[],
    details?: unknown,
  ) {
    super(
      `Bulk operation failed: ${message}, ${
        errors
          .map((e) => e.message)
          .join(", ")
      }`,
      details,
    );
  }
}
