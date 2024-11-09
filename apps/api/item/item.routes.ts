import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.midlleware.ts";
import { AuthHeadersSchema } from "../common/schema/auth.schema.ts";
import { CreateItemRequestSchema } from "./schema/request/create.schema.ts";
import {
  ItemListResponseSchema,
  ItemResponseSchema,
} from "./schema/response/response.schema.ts";
import { standardErrorResponses } from "../common/schema/error.schema.ts";
import { ItemParamsSchema } from "./schema/request/params.schema.ts";
import { UpdateItemRequestSchema } from "./schema/request/update.schema.ts";
import { UpdateReadingProgressRequestSchema } from "./schema/request/update-progress.schema.ts";
import { BulkDeleteRequestSchema } from "./schema/request/bulk-delete.schema.ts";
import { ListItemsQuerySchema } from "./schema/request/list.schema.ts";

export const createItemRoute = createRoute({
  method: "post",
  path: "/item",
  tags: ["Items"],
  middlewares: [authMiddleware],
  summary: "Create a new item",
  description: "Create a new reading list item with the specified content",
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
      description: "Item created successfully",
      content: {
        "application/json": {
          schema: ItemResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const updateItemRoute = createRoute({
  method: "patch",
  path: "/item/{id}",
  tags: ["Items"],
  middlewares: [authMiddleware],
  summary: "Update an existing item",
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
      description: "Item updated successfully",
      content: {
        "application/json": {
          schema: ItemResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const getItemRoute = createRoute({
  method: "get",
  path: "/item/{id}",
  tags: ["Items"],
  middlewares: [authMiddleware],
  summary: "Get a single item",
  request: {
    headers: AuthHeadersSchema,
    params: ItemParamsSchema,
  },
  responses: {
    200: {
      description: "Item retrieved successfully",
      content: {
        "application/json": {
          schema: ItemResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const updateReadingProgressRoute = createRoute({
  method: "patch",
  path: "/item/{id}/reading-progress",
  tags: ["Items"],
  middlewares: [authMiddleware],
  summary: "Update reading progress of an item",
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
  middlewares: [authMiddleware],
  summary: "Delete an item",
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
  middlewares: [authMiddleware],
  summary: "Bulk delete items",
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
  middlewares: [authMiddleware],
  summary: "List all items",
  description:
    "Retrieve a list of items with optional filtering and pagination",
  request: {
    headers: AuthHeadersSchema,
    query: ListItemsQuerySchema,
  },
  responses: {
    200: {
      description: "Items retrieved successfully",
      content: {
        "application/json": {
          schema: ItemListResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});
