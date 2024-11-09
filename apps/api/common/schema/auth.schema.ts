import { z } from "@hono/zod-openapi";

export const AuthHeadersSchema = z.object({
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
