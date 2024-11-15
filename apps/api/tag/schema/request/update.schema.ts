import { z } from "@hono/zod-openapi";
import { enumValuesTuple } from "@kairos/shared/utils";
import { TAG_COLOR } from "@kairos/shared/constants";

export const UpdateTagRequestSchema = z.object({
  name: z.string().openapi({
    example: "coding",
    description: "New name for the tag",
  }),
  color: z.enum(enumValuesTuple(TAG_COLOR)).openapi({
    example: TAG_COLOR.GREEN,
    description: "New color for the tag",
  }),
});
