import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { SessionSecurity } from "../common/schema/auth.schema.ts";
import { standardErrorResponses } from "../common/schema/error.schema.ts";
import { CollectionParamsSchema } from "./schema/request/params.schema.ts";
import {
  CollectionListResponseSchema,
  CollectionResponseSchema,
} from "./schema/response/response.schema.ts";
import { CreateCollectionRequestSchema } from "./schema/request/create.schema.ts";
import { UpdateCollectionRequestSchema } from "./schema/request/update.schema.ts";
import {
  AddToCollectionRequestSchema,
  ArchiveItemRequestSchema,
  BulkArchiveRequestSchema,
  MoveItemRequestSchema,
  RemoveFromCollectionRequestSchema,
} from "./schema/request/item-operations.schema.ts";
import { CollectionQuerySchema } from "./schema/request/list.schema.ts";

export const createCollectionRoute = createRoute({
  method: "post",
  path: "/collection",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Create a new collection",
  description: "Create a new collection to organize items",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCollectionRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Collection created successfully",
      content: {
        "application/json": {
          schema: CollectionResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const updateCollectionRoute = createRoute({
  method: "patch",
  path: "/collection/{id}",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Update an existing collection",
  request: {
    params: CollectionParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateCollectionRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Collection updated successfully",
      content: {
        "application/json": {
          schema: CollectionResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const getCollectionRoute = createRoute({
  method: "get",
  path: "/collection/{id}",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Get a single collection",
  request: {
    params: CollectionParamsSchema,
  },
  responses: {
    200: {
      description: "Collection retrieved successfully",
      content: {
        "application/json": {
          schema: CollectionResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const listCollectionsRoute = createRoute({
  method: "get",
  path: "/collections",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "List all collections",
  description: "Retrieve a list of all collections for the authenticated user",
  request: {
    query: CollectionQuerySchema,
  },
  responses: {
    200: {
      description: "Collections retrieved successfully",
      content: {
        "application/json": {
          schema: CollectionListResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const deleteCollectionRoute = createRoute({
  method: "delete",
  path: "/collection/{id}",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Delete a collection",
  request: {
    params: CollectionParamsSchema,
  },
  responses: {
    204: {
      description: "Collection deleted successfully",
    },
    ...standardErrorResponses,
  },
});

export const addToCollectionRoute = createRoute({
  method: "post",
  path: "/collection/{id}/items",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Add items to a collection",
  description: "Add one or more items to an existing collection",
  request: {
    params: CollectionParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: AddToCollectionRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Item added to collection successfully",
    },
    ...standardErrorResponses,
  },
});

export const getItemsInCollectionRoute = createRoute({
  method: "get",
  path: "/collection/{id}/items",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Get items in a collection",
  description: "Retrieve a list of items in a collection",
  request: {
    params: CollectionParamsSchema,
  },
  responses: {
    204: {
      description: "Items in collection retrieved successfully",
    },
    ...standardErrorResponses,
  },
});

export const removeFromCollectionRoute = createRoute({
  method: "delete",
  path: "/collection/{id}/items",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Remove items from a collection",
  description: "Remove one or more items from an existing collection",
  request: {
    params: CollectionParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: RemoveFromCollectionRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Item removed from collection successfully",
    },
    ...standardErrorResponses,
  },
});

export const moveItemRoute = createRoute({
  method: "post",
  path: "/collections/move",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Move items between collections",
  description: "Move items from one collection to another",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MoveItemRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Item moved successfully",
    },
    ...standardErrorResponses,
  },
});

export const archiveItemRoute = createRoute({
  method: "post",
  path: "/collections/archive",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Archive an item",
  description: "Archive a single item from a collection",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ArchiveItemRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Item archived successfully",
    },
    ...standardErrorResponses,
  },
});

export const bulkArchiveRoute = createRoute({
  method: "post",
  path: "/collections/bulk-archive",
  tags: ["Collections"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Bulk archive items",
  description: "Archive multiple items from collections in a single operation",
  request: {
    body: {
      content: {
        "application/json": {
          schema: BulkArchiveRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Items archived successfully",
    },
    ...standardErrorResponses,
  },
});
