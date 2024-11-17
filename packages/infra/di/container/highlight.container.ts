import {
  type Container,
  CreateHighlightUseCase,
  DeleteHighlightUseCase,
  GetHighlightUseCase,
  type HighlightRepository,
  HighlightService,
  ListHighlightsUseCase,
  UpdateHighlightUseCase,
} from "@kairos/core";
import { TOKENS } from "../tokens.ts";
import type { Database } from "../../db/connection.ts";
import { DrizzleHighlightRepository } from "../../db/drizzle/repository/highlight.repository.ts";

export function configureHighlightContainer(container: Container) {
  // Repository
  container.registerSingleton<HighlightRepository>(
    TOKENS.HighlightRepository,
    () => {
      const db = container.resolve<Database>(TOKENS.DbClient);
      return new DrizzleHighlightRepository(db);
    },
  );

  // Services
  container.registerSingleton<HighlightService>(TOKENS.HighlightService, () => {
    const highlightRepo = container.resolve<HighlightRepository>(
      TOKENS.HighlightRepository,
    );
    return new HighlightService(highlightRepo);
  });

  // Use Cases
  container.registerSingleton(TOKENS.CreateHighlightUseCase, () => {
    const highlightService = container.resolve<HighlightService>(
      TOKENS.HighlightService,
    );
    return new CreateHighlightUseCase(highlightService);
  });

  container.registerSingleton(TOKENS.GetHighlightUseCase, () => {
    const highlightService = container.resolve<HighlightService>(
      TOKENS.HighlightService,
    );
    return new GetHighlightUseCase(highlightService);
  });

  container.registerSingleton(TOKENS.UpdateHighlightUseCase, () => {
    const highlightService = container.resolve<HighlightService>(
      TOKENS.HighlightService,
    );
    return new UpdateHighlightUseCase(highlightService);
  });

  container.registerSingleton(TOKENS.DeleteHighlightUseCase, () => {
    const highlightService = container.resolve<HighlightService>(
      TOKENS.HighlightService,
    );
    return new DeleteHighlightUseCase(highlightService);
  });

  container.registerSingleton(TOKENS.ListHighlightsUseCase, () => {
    const highlightService = container.resolve<HighlightService>(
      TOKENS.HighlightService,
    );
    return new ListHighlightsUseCase(highlightService);
  });
}
