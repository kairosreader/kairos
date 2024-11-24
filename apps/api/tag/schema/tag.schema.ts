import { z } from "@hono/zod-openapi";
import { dateSchema } from "../../common/schema/date.schema.ts";
import { idSchema, userIdSchema } from "../../common/schema/id.schema.ts";
import { enumValuesTuple } from "@kairos/shared/utils";
import { TAG_COLOR } from "@kairos/shared/constants";

export const TagInfoSchema = z.object({
  name: z.string().openapi({
    description: "Name of the tag",
  }),
  color: z
    .enum(enumValuesTuple(TAG_COLOR))
    .nullish()
    .transform((val) => val || null)
    .openapi({
      description: "Color of the tag",
    }),
});

export const TagSchema = z
  .object({
    id: idSchema,
    userId: userIdSchema,
    name: z.string(),
    color: z
      .enum(enumValuesTuple(TAG_COLOR))
      .nullish()
      .transform((val) => val || null),
    createdAt: dateSchema,
    updatedAt: dateSchema,
  })
  .openapi("Tag");
