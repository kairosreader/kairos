import { z } from "@hono/zod-openapi";
import { ITEM_STATUS } from "@shared/constants/mod.ts";
import { dateSchema } from "../../common/schema/date.schema.ts";
import { idSchema, userIdSchema } from "@api/common/schema/id.schema.ts";
import { urlSchema } from "@api/common/schema/url.schema.ts";

export const baseItemFields = {
  id: idSchema,
  status: z.enum([
    ITEM_STATUS.PENDING,
    ITEM_STATUS.PROCESSING,
    ITEM_STATUS.READY,
    ITEM_STATUS.FAILED,
  ]),
  title: z.string(),
  excerpt: z.string().optional(),
  coverImage: urlSchema.optional(),
  tags: z.array(z.string()),
  estimatedReadTime: z.number().optional(),
  userId: userIdSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
} as const;
