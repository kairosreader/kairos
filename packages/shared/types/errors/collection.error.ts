import {
  NotFoundError,
  OperationError,
} from "@shared/types/errors/common.error.ts";
import { BaseError } from "@shared/types/errors/base.error.ts";

export class CollectionNotFoundError extends NotFoundError {
  constructor(collectionId: string) {
    super("Collection", collectionId);
  }
}

export class CollectionOperationError extends OperationError {
  constructor(message: string) {
    super(message);
  }
}

export class CollectionLimitExceededError extends BaseError {
  status = 403;
  constructor() {
    super("Maximum number of collections reached", "LIMIT_EXCEEDED");
  }
}
