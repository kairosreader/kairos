// packages/usecases/usecases.provider.ts
import type { Container, Module } from "@kairos/di";
import { DbModule } from "@kairos/db";
import { AuthModule } from "@kairos/auth";
import { QueueModule } from "@kairos/queue";
import { ContentModule } from "@kairos/content";
import { HighlightUseCasesProvider } from "./highlight/highlight-usecases.provider.ts";
import { UserUseCasesProvider } from "./user/user-usecases.provider.ts";
import { CollectionUseCasesProvider } from "./collection/collection-usecases.provider.ts";
import { ItemUseCasesProvider } from "./item/item-usecases.provider.ts";
import { TagUseCasesProvider } from "./tag/tag-usecases.provider.ts";
import { CollectionServicesProvider } from "./collection/collection-services.provider.ts";
import { ItemServicesProvider } from "./item/item-services.provider.ts";
import { HighlightServicesProvider } from "./highlight/highlight-services.provider.ts";
import { TagServicesProvider } from "./tag/tag-services.provider.ts";
import { UserServicesProvider } from "./user/user-services.provider.ts";

export interface UseCasesModuleConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

export class UseCasesModule implements Module {
  constructor(private config: UseCasesModuleConfig) {}

  register(container: Container): void {
    this.registerInfraProviders(container);
    this.registerServicesProviders(container);
    this.registerUseCaseProviders(container);
  }

  private registerInfraProviders(container: Container): void {
    new DbModule().register(container);
    new AuthModule().register(container);
    new QueueModule(this.config).register(container);
    new ContentModule().register(container);
  }

  private registerServicesProviders(container: Container): void {
    new ItemServicesProvider().register(container);
    new CollectionServicesProvider().register(container);
    new TagServicesProvider().register(container);
    new HighlightServicesProvider().register(container);
    new UserServicesProvider().register(container);
  }

  private registerUseCaseProviders(container: Container): void {
    new ItemUseCasesProvider().register(container);
    new CollectionUseCasesProvider().register(container);
    new TagUseCasesProvider().register(container);
    new HighlightUseCasesProvider().register(container);
    new UserUseCasesProvider().register(container);
  }
}
