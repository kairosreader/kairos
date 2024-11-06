import { NotFoundError } from "@shared/types/errors/common.error.ts";

export class ItemNotFoundError extends NotFoundError {
  constructor(itemId: string) {
    super("Item", itemId);
  }
}
