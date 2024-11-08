import { NotFoundError } from "./common.error.ts";

export class ItemNotFoundError extends NotFoundError {
  constructor(itemId: string) {
    super("Item", itemId);
  }
}
