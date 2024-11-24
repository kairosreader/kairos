import { z } from "@hono/zod-openapi";
import { TAG_COLOR } from "@kairos/shared/constants";
import { enumValuesTuple } from "@kairos/shared";

export const UpdateTagRequestSchema = z
  .object({
    name: z.string().optional().openapi({
      example: "programming",
      description: "Name of the tag",
    }),
    color: z.enum(enumValuesTuple(TAG_COLOR)).optional(),
  })
  .openapi({
    example: {
      name: "programming",
      color: TAG_COLOR.BLUE,
    },
    description: "Partial update for the tag",
  });
