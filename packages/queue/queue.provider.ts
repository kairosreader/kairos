import type { QueueService } from "@kairos/core";
import type { Container, Module } from "@kairos/di";
import { QUEUE_TOKENS } from "@kairos/di/tokens";
import {
  type BullQueueConfig,
  BullQueueService,
} from "./services/bull.service.ts";

export class QueueModule implements Module {
  constructor(private readonly config: BullQueueConfig) {}

  register(container: Container): void {
    container.registerSingleton<QueueService>(QUEUE_TOKENS.QueueService, () => {
      return new BullQueueService(this.config);
    });
  }
}
