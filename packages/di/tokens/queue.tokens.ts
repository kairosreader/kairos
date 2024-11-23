export const QUEUE_TOKENS = {
  QueueService: "queue.queue-service",
  Handlers: {
    ArticleHandler: "queue.handlers.article",
    EmailHandler: "queue.handlers.email",
  },
} as const;
