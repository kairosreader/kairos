import { z } from "@hono/zod-openapi";
import { idSchema } from "../../../common/schema/id.schema.ts";

export const CollectionParamsSchema = z.object({
  id: idSchema,
});
