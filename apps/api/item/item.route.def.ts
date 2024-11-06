import { createRoute } from "@hono/zod-openapi";
import {
  AuthHeadersSchema,
  CreateItemRequestSchema,
  ItemListResponseSchema,
  ItemParamsSchema,
  ItemResponseSchema,
  UpdateItemRequestSchema,
} from "@api/item/item.schema.ts";
import { errorResponses } from "@api/common/error.schema.ts";

export const createItemRoute = createRoute({
  method: "post",
  path: "/items",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateItemRequestSchema,
        },
      },
    },
    headers: AuthHeadersSchema,
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
    ...errorResponses,
  },
  tags: ["Items"],
});

export const updateItemRoute = createRoute({
  method: "patch",
  path: "/items/{id}",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateItemRequestSchema,
        },
      },
    },
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
      description: "Item updated successfully",
    },
    ...errorResponses,
  },
  tags: ["Items"],
});

export const getItemRoute = createRoute({
  method: "get",
  path: "/items/{id}",
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
    ...errorResponses,
  },
  tags: ["Items"],
});

export const listItemsRoute = createRoute({
  method: "get",
  path: "/items",
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
    ...errorResponses,
  },
  tags: ["Items"],
});

export const deleteItemRoute = createRoute({
  method: "delete",
  path: "/items/{id}",
  request: {
    headers: AuthHeadersSchema,
    params: ItemParamsSchema,
  },
  responses: {
    204: {
      description: "Item deleted successfully",
    },
    ...errorResponses,
  },
  tags: ["Items"],
});
