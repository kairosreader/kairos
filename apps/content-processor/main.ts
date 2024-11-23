import type {
  ArticleProcessingHandler,
  EmailProcessingHandler,
  QueueService,
} from "@kairos/core";
import { QUEUE_NAMES } from "@kairos/shared";
import { configureContainer } from "./container.config.ts";
import { QUEUE_TOKENS } from "@kairos/di";

const container = configureContainer({
  redis: {
    host: Deno.env.get("REDIS_HOST") || "localhost",
    port: parseInt(Deno.env.get("REDIS_PORT") || "6379"),
    password: Deno.env.get("REDIS_PASSWORD"),
  },
});

// Get services
const queueService = container.resolve<QueueService>(QUEUE_TOKENS.QueueService);
const articleHandler = container.resolve<ArticleProcessingHandler>(
  QUEUE_TOKENS.Handlers.ArticleHandler,
);
const emailHandler = container.resolve<EmailProcessingHandler>(
  QUEUE_TOKENS.Handlers.EmailHandler,
);

// Register handlers
queueService.registerHandler(QUEUE_NAMES.ARTICLE_PROCESSING, articleHandler);
queueService.registerHandler(QUEUE_NAMES.EMAIL_PROCESSING, emailHandler);

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down queue service...");
  await queueService.shutdown();
  Deno.exit(0);
}

// Cross-platform signal handling
if (Deno.build.os === "windows") {
  Deno.addSignalListener("SIGINT", shutdown);
  Deno.addSignalListener("SIGBREAK", shutdown);
} else {
  Deno.addSignalListener("SIGINT", shutdown);
  Deno.addSignalListener("SIGTERM", shutdown);
}

console.log("Content processor is running...");
