import type { Container } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import type {
  BulkDeleteHighlightsUseCase,
  CreateHighlightUseCase,
  DeleteHighlightUseCase,
  GetHighlightUseCase,
  ListHighlightsUseCase,
  UpdateHighlightUseCase,
} from "@kairos/core/highlight";
import { HighlightController } from "./highlight.controller.ts";

export function createHighlightController(
  container: Container,
): HighlightController {
  return new HighlightController(
    container.resolve<CreateHighlightUseCase>(
      USECASES_TOKENS.Highlight.CreateHighlightUseCase,
    ),
    container.resolve<UpdateHighlightUseCase>(
      USECASES_TOKENS.Highlight.UpdateHighlightUseCase,
    ),
    container.resolve<GetHighlightUseCase>(
      USECASES_TOKENS.Highlight.GetHighlightUseCase,
    ),
    container.resolve<ListHighlightsUseCase>(
      USECASES_TOKENS.Highlight.ListHighlightsUseCase,
    ),
    container.resolve<DeleteHighlightUseCase>(
      USECASES_TOKENS.Highlight.DeleteHighlightUseCase,
    ),
    container.resolve<BulkDeleteHighlightsUseCase>(
      USECASES_TOKENS.Highlight.BulkDeleteHighlightsUseCase,
    ),
  );
}
