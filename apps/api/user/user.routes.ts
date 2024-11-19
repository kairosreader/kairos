import { createRoute } from "@hono/zod-openapi";
import { standardErrorResponses } from "../common/schema/error.schema.ts";
import { internalApiMiddleware } from "../middleware/internal-api.middleware.ts";
import { CreateUserSchema } from "./schema/request/create.schema.ts";
import { UserResponseSchema } from "./schema/response/response.schema.ts";
import {
  AuthHeadersInternalAPIKeySchema,
  InternalAPISecurity,
  SessionSecurity,
} from "../common/schema/auth.schema.ts";

export const createUserRoute = createRoute({
  method: "post",
  path: "/internal/user",
  tags: ["Internal"],
  security: [InternalAPISecurity],
  middleware: [internalApiMiddleware],
  summary: "Create a new user from auth webhook",
  request: {
    headers: AuthHeadersInternalAPIKeySchema,
    body: {
      content: {
        "application/json": {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
      description: "User created successfully",
    },
    ...standardErrorResponses,
  },
});

export const deleteUserRoute = createRoute({
  method: "delete",
  path: "/user",
  tags: ["User"],
  security: [SessionSecurity],
  middleware: [],
  summary: "Delete the currently authenticated user",
  responses: {
    204: {
      description: "User deleted successfully",
    },
    ...standardErrorResponses,
  },
});
