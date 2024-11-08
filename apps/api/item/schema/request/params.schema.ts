import { z } from "@hono/zod-openapi";
import { idSchema } from "../../../common/schema/id.schema.ts";

export const ItemParamsSchema = z.object({
  id: idSchema,
});

export type ItemParams = z.infer<typeof ItemParamsSchema>;
