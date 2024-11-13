import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import {
  AuthHeadersSchema,
  BearerSecurity,
} from "../common/schema/auth.schema.ts";
import { standardErrorResponses } from "../common/schema/error.schema.ts";
import { CollectionParamsSchema } from "./schema/request/params.schema.ts";
import {
  CollectionListResponseSchema,
  CollectionResponseSchema,
} from "./schema/response/response.schema.ts";
import { CreateCollectionRequestSchema } from "./schema/request/create.schema.ts";
import { UpdateCollectionRequestSchema } from "./schema/request/update.schema.ts";
import { AddToCollectionRequestSchema, ArchiveItemRequestSchema, BulkArchiveRequestSchema, MoveItemRequestSchema, RemoveFromCollectionRequestSchema } from "./schema/request/item-operations.schema.ts";

export const createCollectionRoute = createRoute({
  method: "post",
  path: "/collection",
  tags: ["Collections"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
    200: {
      description: "Item added to collection successfully",
    },
    ...standardErrorResponses,
  },
});

export const removeFromCollectionRoute = createRoute({
  method: "delete",
  path: "/collection/{id}/items",
  tags: ["Collections"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
    200: {
      description: "Item removed from collection successfully",
    },
    ...standardErrorResponses,
  },
});

export const moveItemRoute = createRoute({
  method: "post",
  path: "/collections/move",
  tags: ["Collections"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: {
        "application/json": {
          schema: MoveItemRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Item moved successfully",
    },
    ...standardErrorResponses,
  },
});

export const archiveItemRoute = createRoute({
  method: "post",
  path: "/collections/archive",
  tags: ["Collections"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: {
        "application/json": {
          schema: ArchiveItemRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Item archived successfully",
    },
    ...standardErrorResponses,
  },
});

export const bulkArchiveRoute = createRoute({
  method: "post",
  path: "/collections/bulk-archive",
  tags: ["Collections"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
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
