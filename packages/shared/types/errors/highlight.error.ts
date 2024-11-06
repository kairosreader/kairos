import { NotFoundError } from "./common.error.ts";

export class HighlightNotFoundError extends NotFoundError {
  constructor(highlightId: string) {
    super("Highlight", highlightId);
  }
}
