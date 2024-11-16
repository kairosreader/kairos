export const TOKENS = {
  // Clients
  DbClient: "DbClient",

  // Repositories
  ItemRepository: "ItemRepository",
  CollectionRepository: "CollectionRepository",
  TagRepository: "TagRepository",

  // Services
  ItemService: "ItemService",
  QueueService: "QueueService",
  ContentExtractorService: "ContentExtractorService",
  CollectionService: "CollectionService",
  ItemManagementService: "ItemManagementService",
  SpecialCollectionService: "SpecialCollectionService",
  TagService: "TagService",

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
  CreateTagUseCase: "CreateTagUseCase",
  UpdateTagUseCase: "UpdateTagUseCase",
  GetTagUseCase: "GetTagUseCase",
  ListTagsUseCase: "ListTagsUseCase",
  DeleteTagUseCase: "DeleteTagUseCase",
  TagItemUseCase: "TagItemUseCase",
  BulkTagUseCase: "BulkTagUseCase",
  MergeTagsUseCase: "MergeTagsUseCase",
} as const;
