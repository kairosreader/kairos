import {
  NotFoundError,
  DuplicateError,
} from "@shared/types/errors/common.error.ts";

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
