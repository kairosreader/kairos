import { z } from "@hono/zod-openapi";
import { ITEM_STATUS, ITEM_TYPE } from "@kairos/shared/constants";
import { dateSchema } from "../../common/schema/date.schema.ts";
import { idSchema, userIdSchema } from "../../common/schema/id.schema.ts";
import { urlSchema } from "../../common/schema/url.schema.ts";
import { enumValues, enumValuesTuple } from "@kairos/shared/utils";

export const baseItemFields = {
  id: idSchema,
  status: z.enum(enumValuesTuple(ITEM_STATUS)),
  title: z.string(),
  excerpt: z.string().optional(),
  coverImage: urlSchema.optional(),
  tags: z.array(z.string()),
  estimatedReadTime: z.number().optional(),
  userId: userIdSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
} as const;

export const itemInfoSchema = z.object({
  itemId: z.string().openapi({
    description: "ID of the item",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  itemType: z.enum(enumValuesTuple(ITEM_TYPE)).openapi({
    description: "Type of the item",
    example: ITEM_TYPE.ARTICLE,
    enum: enumValues(ITEM_TYPE),
  }),
});

export type ItemInfoSchema = z.infer<typeof itemInfoSchema>;