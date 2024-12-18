import { z } from "@hono/zod-openapi";
import { ITEM_TYPE } from "@kairos/shared/constants";
import { baseItemFields } from "./item.schema.ts";
import { urlSchema } from "../../common/schema/url.schema.ts";
import { dateSchema } from "../../common/schema/date.schema.ts";

export const ArticleContentSchema = z
  .object({
    url: urlSchema,
    content: z.string().nullish().transform((val) => val || ""),
    author: z.string().nullish().transform((val) => val || null),
    publishedAt: dateSchema.nullish().transform((val) => val || null),
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
