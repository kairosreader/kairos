import type { ContentExtractorService } from "@kairos/core/content";
import type { Container, Module } from "@kairos/di";
import { CONTENT_TOKENS } from "@kairos/di/tokens";
import { ReadabilityExtractorService } from "./services/readability.service.ts";

export class ContentModule implements Module {
  register(container: Container): void {
    container.registerSingleton<ContentExtractorService>(
      CONTENT_TOKENS.ContentService,
      () => {
        return new ReadabilityExtractorService();
      },
    );
  }
}
