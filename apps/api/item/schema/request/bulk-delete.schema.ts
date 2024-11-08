import { z } from "@hono/zod-openapi";
import { idSchema } from "../../../common/schema/id.schema.ts";

export const BulkDeleteRequestSchema = z.object({
  ids: z.array(idSchema),
});

export type BulkDeleteRequest = z.infer<typeof BulkDeleteRequestSchema>;
