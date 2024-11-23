// apps/api/container.config.ts
import { Container } from "@kairos/di";
import { UseCasesModule, type UseCasesModuleConfig } from "@kairos/usecases";

export function configureContainer(config: UseCasesModuleConfig) {
  const container = new Container();
  new UseCasesModule(config).register(container);
  return container;
}
