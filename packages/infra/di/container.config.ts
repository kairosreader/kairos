import "reflect-metadata";
import type { Container } from "@kairos/core/di";
import { configureQueueContainer } from "./container/queue.container.ts";
import { configureItemContainer } from "./container/item.container.ts";
import { configureCollectionContainer } from "./container/collection.container.ts";

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
  configureQueueContainer(container, config);

  // Configure domain services
  configureItemContainer(container);
  configureCollectionContainer(container);
}
