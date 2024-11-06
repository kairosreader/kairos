import { DuplicateArticleError } from "@shared/types/errors/article.error.ts";
import { NotFoundError } from "@shared/types/errors/common.error.ts";

export class TagNotFoundError extends NotFoundError {
  constructor(tagId: string) {
    super("Tag", tagId);
  }
}

export class TagAlreadyExistsError extends DuplicateArticleError {
  constructor(name: string) {
    super(`Tag "${name}" already exists`);
  }
}
