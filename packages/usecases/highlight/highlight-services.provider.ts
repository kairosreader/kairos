import type { Container, Module } from "@kairos/di";
import { DB_TOKENS, USECASES_TOKENS } from "@kairos/di/tokens";
import { HighlightService } from "@kairos/core/highlight";
import type { HighlightRepository } from "@kairos/core/highlight";

export class HighlightServicesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Highlight.HighlightService,
      () => {
        const highlightRepository = container.resolve<HighlightRepository>(
          DB_TOKENS.HighlightRepository,
        );
        return new HighlightService(highlightRepository);
      },
    );
  }
}
