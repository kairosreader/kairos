import { z } from "@hono/zod-openapi";
import { dateSchema } from "@api/common/schema/date.schema.ts";
import { urlSchema } from "@api/common/schema/url.schema.ts";
import { ITEM_TYPE } from "@shared/constants/mod.ts";
import { baseItemFields } from "./item.schema.ts";

export const ArticleContentSchema = z
  .object({
    url: urlSchema,
    content: z.string(),
    author: z.string().optional(),
    publishedAt: dateSchema,
  })
  .openapi("ArticleContent");

export const ArticleSchema = z.object({
  ...baseItemFields,
  type: z.literal(ITEM_TYPE.ARTICLE),
  content: ArticleContentSchema,
});

export const CreateArticleRequestSchema = z.object({
  type: z.literal(ITEM_TYPE.ARTICLE),
  content: ArticleContentSchema,
});

export const UpdateArticleContentSchema = z.object({
  type: z.literal(ITEM_TYPE.ARTICLE),
  content: ArticleContentSchema.partial(),
});
