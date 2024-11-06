export const TOKENS = {
  // Repositories
  ItemRepository: "ItemRepository",

  // Services
  ItemService: "ItemService",
  QueueService: "QueueService",
  ContentExtractorService: "ContentExtractorService",

  // Handlers
  ArticleProcessingHandler: "ArticleProcessingHandler",
  EmailProcessingHandler: "EmailProcessingHandler",

  // Use Cases
  SaveItemUseCase: "SaveItemUseCase",
  UpdateItemUseCase: "UpdateItemUseCase",
} as const;
