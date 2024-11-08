import { DuplicateError, NotFoundError } from "./common.error.ts";

export class TagNotFoundError extends NotFoundError {
  constructor(tagId: string) {
    super("Tag", tagId);
  }
}

export class TagAlreadyExistsError extends DuplicateError {
  constructor(name: string) {
    super(`Tag "${name}" already exists`);
  }
}
