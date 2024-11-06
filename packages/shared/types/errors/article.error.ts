import { NotFoundError } from "./common.error.ts";
import { DuplicateError } from "./mod.ts";

export class ArticleNotFoundError extends NotFoundError {
  constructor(articleId: string) {
    super("Article", articleId);
  }
}

export class DuplicateArticleError extends DuplicateError {
  constructor(url: string) {
    super(`Article already exists: ${url}`);
  }
}
