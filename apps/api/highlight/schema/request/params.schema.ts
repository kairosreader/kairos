import { z } from "@hono/zod-openapi";

export const HighlightParamsSchema = z.object({
  id: z.string(),
});
