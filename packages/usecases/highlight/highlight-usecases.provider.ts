import type { Container, Module } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import {
  BulkDeleteHighlightsUseCase,
  CreateHighlightUseCase,
  DeleteHighlightUseCase,
  GetHighlightUseCase,
  type HighlightService,
  ListHighlightsUseCase,
  UpdateHighlightUseCase,
} from "@kairos/core/highlight";

export class HighlightUseCasesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Highlight.CreateHighlightUseCase,
      () => {
        const highlightService = container.resolve<HighlightService>(
          USECASES_TOKENS.Highlight.HighlightService,
        );
        return new CreateHighlightUseCase(highlightService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Highlight.GetHighlightUseCase,
      () => {
        const highlightService = container.resolve<HighlightService>(
          USECASES_TOKENS.Highlight.HighlightService,
        );
        return new GetHighlightUseCase(highlightService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Highlight.UpdateHighlightUseCase,
      () => {
        const highlightService = container.resolve<HighlightService>(
          USECASES_TOKENS.Highlight.HighlightService,
        );
        return new UpdateHighlightUseCase(highlightService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Highlight.DeleteHighlightUseCase,
      () => {
        const highlightService = container.resolve<HighlightService>(
          USECASES_TOKENS.Highlight.HighlightService,
        );
        return new DeleteHighlightUseCase(highlightService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Highlight.BulkDeleteHighlightsUseCase,
      () => {
        const highlightService = container.resolve<HighlightService>(
          USECASES_TOKENS.Highlight.HighlightService,
        );
        return new BulkDeleteHighlightsUseCase(highlightService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Highlight.ListHighlightsUseCase,
      () => {
        const highlightService = container.resolve<HighlightService>(
          USECASES_TOKENS.Highlight.HighlightService,
        );
        return new ListHighlightsUseCase(highlightService);
      },
    );
  }
}
