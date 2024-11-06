import { NotFoundError } from "@shared/types/errors/common.error.ts";

export class HighlightNotFoundError extends NotFoundError {
  constructor(highlightId: string) {
    super("Highlight", highlightId);
  }
}
