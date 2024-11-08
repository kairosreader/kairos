import { z } from "@hono/zod-openapi";
import { ArticleSchema } from "@api/item/schema/article.schema.ts";
import { EmailSchema } from "@api/item/schema/email.schema.ts";
import { PdfSchema } from "@api/item/schema/pdf.schema.ts";

export const ItemResponseSchema = z
  .union([ArticleSchema, EmailSchema, PdfSchema])
  .openapi("ItemResponse");

export const ItemListResponseSchema = z
  .array(ItemResponseSchema)
  .openapi("ItemListResponse");
