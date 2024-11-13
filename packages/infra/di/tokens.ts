export const TOKENS = {
  // Repositories
  ItemRepository: "ItemRepository",
  CollectionRepository: "CollectionRepository",

  // Services
  ItemService: "ItemService",
  QueueService: "QueueService",
  ContentExtractorService: "ContentExtractorService",
  CollectionService: "CollectionService",
  ItemManagementService: "ItemManagementService",
  SpecialCollectionService: "SpecialCollectionService",

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
  CreateCollectionUseCase: "CreateCollectionUseCase",
  UpdateCollectionUseCase: "UpdateCollectionUseCase",
  GetCollectionUseCase: "GetCollectionUseCase",
  ListCollectionsUseCase: "ListCollectionsUseCase",
  DeleteCollectionUseCase: "DeleteCollectionUseCase",
  AddToCollectionUseCase: "AddToCollectionUseCase",
  RemoveFromCollectionUseCase: "RemoveFromCollectionUseCase",
  MoveItemUseCase: "MoveItemUseCase",
  ArchiveItemUseCase: "ArchiveItemUseCase",
  BulkArchiveUseCase: "BulkArchiveUseCase",
} as const;
