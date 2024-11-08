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
  GetItemUseCase: "GetItemUseCase",
  ListItemsUseCase: "ListItemsUseCase",
  UpdateReadingProgressUseCase: "UpdateReadingProgressUseCase",
  DeleteItemUseCase: "DeleteItemUseCase",
  BulkDeleteItemsUseCase: "BulkDeleteItemsUseCase",
} as const;
