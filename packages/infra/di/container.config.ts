import "reflect-metadata";
import type { Container } from "@kairos/core/di";
import { configureDbContainer } from "./container/db.container.ts";
import { configureQueueContainer } from "./container/queue.container.ts";
import { configureItemContainer } from "./container/item.container.ts";
import { configureCollectionContainer } from "./container/collection.container.ts";
import { configureTagContainer } from "./container/tag.container.ts";
import { configureHighlightContainer } from "./container/highlight.container.ts";
import { configureUserContainer } from "./container/user.container.ts";

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

  // Configure domain services
  configureItemContainer(container);
  configureCollectionContainer(container);
  configureTagContainer(container);
  configureHighlightContainer(container);
  configureUserContainer(container);
}
