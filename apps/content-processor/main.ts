import {
  TsyringeContainer,
  configureContainer,
  TOKENS,
} from "@kairos/infra/di";
import { QueueService } from "@kairos/core";
import { ITEM_TYPE } from "@kairos/shared";
import {
  ArticleProcessingHandler,
  EmailProcessingHandler,
} from "@kairos/infra/queue";

const container = new TsyringeContainer();

// Configure container
configureContainer(container, {
  redis: {
    host: Deno.env.get("REDIS_HOST") || "localhost",
    port: parseInt(Deno.env.get("REDIS_PORT") || "6379"),
    password: Deno.env.get("REDIS_PASSWORD"),
  },
});

// Get services
const queueService = container.resolve<QueueService>(TOKENS.QueueService);
const articleHandler = container.resolve<ArticleProcessingHandler>(
  TOKENS.ArticleProcessingHandler,
);
const emailHandler = container.resolve<EmailProcessingHandler>(
  TOKENS.EmailProcessingHandler,
);

// Register handlers
queueService.registerHandler(`${ITEM_TYPE.ARTICLE}.process`, articleHandler);
queueService.registerHandler(`${ITEM_TYPE.EMAIL}.process`, emailHandler);

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down queue service...");
  await queueService.shutdown();
  Deno.exit(0);
}

Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);

console.log("Content processor is running...");
