import { z } from "@hono/zod-openapi";
import { enumValuesTuple } from "@kairos/shared/utils";
import { TAG_COLOR } from "@kairos/shared/constants";

export const CreateTagRequestSchema = z.object({
  name: z.string().openapi({
    example: "programming",
    description: "Name of the tag",
  }),
  color: z.enum(enumValuesTuple(TAG_COLOR)).optional().openapi({
    example: TAG_COLOR.BLUE,
    description: "Optional color for the tag",
  }),
});
