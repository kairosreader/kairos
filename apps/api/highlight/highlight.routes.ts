import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import {
  AuthHeadersSchema,
  BearerSecurity,
} from "../common/schema/auth.schema.ts";
import { standardErrorResponses } from "../common/schema/error.schema.ts";
import { HighlightParamsSchema } from "./schema/request/params.schema.ts";
import {
  HighlightListResponseSchema,
  HighlightResponseSchema,
} from "./schema/response/response.schema.ts";
import { CreateHighlightRequestSchema } from "./schema/request/create.schema.ts";
import { UpdateHighlightRequestSchema } from "./schema/request/update.schema.ts";
import { HighlightQuerySchema } from "./schema/request/list.schema.ts";

export const createHighlightRoute = createRoute({
  method: "post",
  path: "/highlight",
  tags: ["Highlights"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Create a new highlight",
  request: {
    headers: AuthHeadersSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateHighlightRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HighlightResponseSchema,
        },
      },
      description: "Highlight created successfully",
    },
    ...standardErrorResponses,
  },
});

export const getHighlightRoute = createRoute({
  method: "get",
  path: "/highlights/{id}",
  tags: ["Highlights"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Get a single highlight",
  request: {
    headers: AuthHeadersSchema,
    params: HighlightParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HighlightResponseSchema,
        },
      },
      description: "Highlight retrieved successfully",
    },
    ...standardErrorResponses,
  },
});

export const updateHighlightRoute = createRoute({
  method: "patch",
  path: "/highlights/{id}",
  tags: ["Highlights"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Update an existing highlight",
  request: {
    headers: AuthHeadersSchema,
    params: HighlightParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateHighlightRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HighlightResponseSchema,
        },
      },
      description: "Highlight updated successfully",
    },
    ...standardErrorResponses,
  },
});

export const deleteHighlightRoute = createRoute({
  method: "delete",
  path: "/highlights/{id}",
  tags: ["Highlights"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "Delete a highlight",
  request: {
    headers: AuthHeadersSchema,
    params: HighlightParamsSchema,
  },
  responses: {
    204: {
      description: "Highlight deleted successfully",
    },
    ...standardErrorResponses,
  },
});

export const listHighlightsRoute = createRoute({
  method: "get",
  path: "/highlights",
  tags: ["Highlights"],
  security: [BearerSecurity],
  middleware: [authMiddleware],
  summary: "List all highlights",
  description:
    "Retrieve a paginated list of highlights with optional query and sorting",
  request: {
    headers: AuthHeadersSchema,
    query: HighlightQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HighlightListResponseSchema,
        },
      },
      description: "Highlights retrieved successfully",
    },
    ...standardErrorResponses,
  },
});
