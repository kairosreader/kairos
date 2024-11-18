import { z } from "@hono/zod-openapi";

// Security schemes
export const SessionSecurity = {
  Session: [],
};

export const InternalAPISecurity = {
  InternalAPIKey: [],
};

// Request schemas for internal API
export const AuthHeadersInternalAPIKeySchema = z.object({
  "x-api-key": z.string().openapi({
    param: {
      name: "x-api-key",
      in: "header",
      required: true,
      description: "Internal API key for authentication",
    },
    example: "INTERNAL_API_KEY",
  }),
});
