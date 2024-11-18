import { z } from "@hono/zod-openapi";

export const AuthHeadersBearerSchema = z.object({
  authorization: z.string().openapi({
    param: {
      name: "authorization",
      in: "header",
      required: true,
      description: "Bearer token for authentication",
    },
    example: "Bearer eyJhbGciOiJIUzI1NiIsIn...",
  }),
});

export const BearerSecurity = {
  Bearer: [],
};

export const AuthHeadersInternalAPIKeySchema = z.object({
  authorization: z.string().openapi({
    param: {
      name: "authorization",
      in: "header",
      required: true,
      description: "Internal API key for authentication",
    },
    example: "INTERNAL_API_KEY",
  }),
});

export const InternalAPISecurity = {
  InternalAPIKey: [],
};
