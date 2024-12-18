import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { SessionSecurity } from "../common/schema/auth.schema.ts";
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
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Create a new tag",
  description: "Create a new tag with the specified name and color",
  request: {
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
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Update an existing tag",
  description: "Update the name or color of an existing tag",
  request: {
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
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Get a single tag",
  request: {
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
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "List all tags",
  description:
    "Retrieve a paginated list of tags with optional query and sorting",
  request: {
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
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Delete a tag",
  request: {
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
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Apply tags to an item",
  request: {
    body: {
      content: {
        "application/json": {
          schema: TagItemRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Tags applied to item successfully",
    },
    ...standardErrorResponses,
  },
});

export const bulkTagRoute = createRoute({
  method: "post",
  path: "/tags/bulk-apply",
  tags: ["Tags"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Apply tags to multiple items",
  request: {
    body: {
      content: {
        "application/json": {
          schema: BulkTagRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Tags applied to items successfully",
    },
    ...standardErrorResponses,
  },
});

export const mergeTagsRoute = createRoute({
  method: "post",
  path: "/tags/merge",
  tags: ["Tags"],
  security: [SessionSecurity],
  middleware: [authMiddleware],
  summary: "Merge tags",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MergeTagsRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "Tags merged successfully",
    },
    ...standardErrorResponses,
  },
});
