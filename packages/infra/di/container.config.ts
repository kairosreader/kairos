import "reflect-metadata";
import type { Container } from "@kairos/core/di";
import { configureDbContainer } from "./container/db.container.ts";
import { configureQueueContainer } from "./container/queue.container.ts";
import {
  configureItemBasicServices,
  configureItemUseCases,
} from "./container/item.container.ts";
import {
  configureTagBasicServices,
  configureTagUseCases,
} from "./container/tag.container.ts";
import {
  configureCollectionBasicServices,
  configureCollectionUseCases,
} from "./container/collection.container.ts";
import {
  configureHighlightBasicServices,
  configureHighlightUseCases,
} from "./container/highlight.container.ts";
import {
  configureUserBasicServices,
  configureUserUseCases,
} from "./container/user.container.ts";

export function configureContainer(
  container: Container,
  config: {
    redis: {
      host: string;
      port: number;
      password?: string;
    };
  },
) {
  // Configure infrastructure services first
  configureDbContainer(container);
  configureQueueContainer(container, config);

  // Configure all basic services first
  configureItemBasicServices(container);
  configureTagBasicServices(container);
  configureCollectionBasicServices(container);
  configureHighlightBasicServices(container);
  configureUserBasicServices(container);

  // Configure all use cases after services are registered
  configureItemUseCases(container);
  configureTagUseCases(container);
  configureCollectionUseCases(container);
  configureHighlightUseCases(container);
  configureUserUseCases(container);
}
