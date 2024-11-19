export const TOKENS = {
  // Clients
  DbClient: "DbClient",

  // Repositories
  ItemRepository: "ItemRepository",
  CollectionRepository: "CollectionRepository",
  TagRepository: "TagRepository",
  HighlightRepository: "HighlightRepository",
  UserRepository: "UserRepository",

  // Services
  ItemService: "ItemService",
  QueueService: "QueueService",
  ContentExtractorService: "ContentExtractorService",
  CollectionService: "CollectionService",
  ItemManagementService: "ItemManagementService",
  SpecialCollectionService: "SpecialCollectionService",
  TagService: "TagService",
  HighlightService: "HighlightService",
  UserService: "UserService",
  IdentityService: "IdentityService",

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
  GetItemsInCollectionUseCase: "GetItemsInCollectionUseCase",
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
  CreateHighlightUseCase: "CreateHighlightUseCase",
  UpdateHighlightUseCase: "UpdateHighlightUseCase",
  GetHighlightUseCase: "GetHighlightUseCase",
  ListHighlightsUseCase: "ListHighlightsUseCase",
  DeleteHighlightUseCase: "DeleteHighlightUseCase",
  BulkDeleteHighlightsUseCase: "BulkDeleteHighlightsUseCase",
  CreateUserUseCase: "CreateUserUseCase",
  DeleteUserUseCase: "DeleteUserUseCase",
} as const;
