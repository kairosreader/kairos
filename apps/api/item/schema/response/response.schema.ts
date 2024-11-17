import { z } from "@hono/zod-openapi";
import { ArticleSchema } from "../article.schema.ts";
import { EmailSchema } from "../email.schema.ts";
import { PdfSchema } from "../pdf.schema.ts";
import { PageInfoSchema } from "../../../common/schema/pagination.schema.ts";

export const ItemResponseSchema = z
  .union([ArticleSchema, EmailSchema, PdfSchema])
  .openapi("ItemResponse");

export const ItemListResponseSchema = z.object({
  items: z.array(ItemResponseSchema).openapi({
    description: "List of items",
  }),
  pageInfo: PageInfoSchema,
}).openapi("ItemListResponse");

export type ItemResponse = z.infer<typeof ItemResponseSchema>;
export type ItemListResponse = z.infer<typeof ItemListResponseSchema>;
