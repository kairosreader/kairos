import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import {
  AuthHeadersBearerSchema,
  BearerSecurity,
} from "../common/schema/auth.schema.ts";
import { standardErrorResponses } from "../common/schema/error.schema.ts";
import { TagParamsSchema } from "./schema/request/params.schema.ts";
import {
  TagListResponseSchema,
  TagResponseSchema,
} from "./schema/response/response.schema.ts";
import { CreateTagRequestSchema } from "./schema/request/create.schema.ts";
import { UpdateTagRequestSchema } from "./schema/request/update.schema.ts";
import {
  BulkTagRequestSchema,
  MergeTagsRequestSchema,
  TagItemRequestSchema,
} from "./schema/request/tag-operations.schema.ts";
import { TagQuerySchema } from "./schema/request/list.schema.ts";

export const createTagRoute = createRoute({
  method: "post",
  path: "/tag",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Create a new tag",
  description: "Create a new tag with the specified name and color",
  request: {
    headers: AuthHeadersBearerSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateTagRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Tag created successfully",
      content: {
        "application/json": {
          schema: TagResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const updateTagRoute = createRoute({
  method: "patch",
  path: "/tag/{id}",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Update an existing tag",
  description: "Update the name or color of an existing tag",
  request: {
    headers: AuthHeadersBearerSchema,
    params: TagParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateTagRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tag updated successfully",
      content: {
        "application/json": {
          schema: TagResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const getTagRoute = createRoute({
  method: "get",
  path: "/tag/{id}",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Get a single tag",
  request: {
    headers: AuthHeadersBearerSchema,
    params: TagParamsSchema,
  },
  responses: {
    200: {
      description: "Tag retrieved successfully",
      content: {
        "application/json": {
          schema: TagResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const listTagsRoute = createRoute({
  method: "get",
  path: "/tags",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "List all tags",
  description:
    "Retrieve a paginated list of tags with optional query and sorting",
  request: {
    headers: AuthHeadersBearerSchema,
    query: TagQuerySchema,
  },
  responses: {
    200: {
      description: "Tags retrieved successfully",
      content: {
        "application/json": {
          schema: TagListResponseSchema,
        },
      },
    },
    ...standardErrorResponses,
  },
});

export const deleteTagRoute = createRoute({
  method: "delete",
  path: "/tag/{id}",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Delete a tag",
  request: {
    headers: AuthHeadersBearerSchema,
    params: TagParamsSchema,
  },
  responses: {
    204: {
      description: "Tag deleted successfully",
    },
    ...standardErrorResponses,
  },
});

export const tagItemRoute = createRoute({
  method: "post",
  path: "/tags/apply",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Apply tags to an item",
  request: {
    headers: AuthHeadersBearerSchema,
    body: {
      content: {
        "application/json": {
          schema: TagItemRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tags applied to item successfully",
    },
    ...standardErrorResponses,
  },
});

export const bulkTagRoute = createRoute({
  method: "post",
  path: "/tags/bulk-apply",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Apply tags to multiple items",
  request: {
    headers: AuthHeadersBearerSchema,
    body: {
      content: {
        "application/json": {
          schema: BulkTagRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tags applied to items successfully",
    },
    ...standardErrorResponses,
  },
});

export const mergeTagsRoute = createRoute({
  method: "post",
  path: "/tags/merge",
  tags: ["Tags"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Merge tags",
  request: {
    headers: AuthHeadersBearerSchema,
    body: {
      content: {
        "application/json": {
          schema: MergeTagsRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tags merged successfully",
    },
    ...standardErrorResponses,
  },
});
