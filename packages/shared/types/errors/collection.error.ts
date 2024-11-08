import { BaseError } from "./base.error.ts";
import { NotFoundError, OperationError } from "./common.error.ts";

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
