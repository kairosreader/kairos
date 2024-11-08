import { createRoute } from "@hono/zod-openapi";
import { AuthHeadersSchema } from "@api/common/schema/auth.schema.ts";
import { standardErrorResponses } from "@api/common/schema/error.schema.ts";
import { authMiddleware } from "@api/middleware/auth.midlleware.ts";
import { CreateItemRequestSchema } from "@api/item/schema/request/create.schema.ts";
import {
  ItemListResponseSchema,
  ItemResponseSchema,
} from "@api/item/schema/response/response.schema.ts";
import { ItemParamsSchema } from "@api/item/schema/request/params.schema.ts";
import { UpdateItemRequestSchema } from "@api/item/schema/request/update.schema.ts";
import { UpdateReadingProgressRequestSchema } from "@api/item/schema/request/update-progress.schema.ts";
import { BulkDeleteRequestSchema } from "@api/item/schema/request/bulk-delete.schema.ts";

export const createItemRoute = createRoute({
  method: "post",
  path: "/item",
  tags: ["Items"],
  summary: "Create a new item",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateItemRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: ItemResponseSchema,
        },
      },
      description: "Item created successfully",
    },
    ...standardErrorResponses,
  },
});

export const updateItemRoute = createRoute({
  method: "patch",
  path: "/item/{id}",
  tags: ["Items"],
  summary: "Update an existing item",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    params: ItemParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateItemRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ItemResponseSchema,
        },
      },
      description: "Item updated successfully",
    },
    ...standardErrorResponses,
  },
});

export const getItemRoute = createRoute({
  method: "get",
  path: "/item/{id}",
  tags: ["Items"],
  summary: "Get a single item",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    params: ItemParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ItemResponseSchema,
        },
      },
      description: "Item retrieved successfully",
    },
    ...standardErrorResponses,
  },
});

export const updateReadingProgressRoute = createRoute({
  method: "patch",
  path: "/item/{id}/reading-progress",
  tags: ["Items"],
  summary: "Update reading progress of an item",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    params: ItemParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateReadingProgressRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Reading progress updated successfully",
    },
    ...standardErrorResponses,
  },
});

export const deleteItemRoute = createRoute({
  method: "delete",
  path: "/item/{id}",
  tags: ["Items"],
  summary: "Delete an item",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    params: ItemParamsSchema,
  },
  responses: {
    204: {
      description: "Item deleted successfully",
    },
    ...standardErrorResponses,
  },
});

export const bulkDeleteItemsRoute = createRoute({
  method: "delete",
  path: "/items",
  tags: ["Items"],
  summary: "Bulk delete items",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: {
        "application/json": {
          schema: BulkDeleteRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Items deleted successfully",
    },
    ...standardErrorResponses,
  },
});

export const listItemsRoute = createRoute({
  method: "get",
  path: "/items",
  tags: ["Items"],
  summary: "List all items",
  middlewares: [authMiddleware],
  request: {
    headers: AuthHeadersSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ItemListResponseSchema,
        },
      },
      description: "Items retrieved successfully",
    },
    ...standardErrorResponses,
  },
});
