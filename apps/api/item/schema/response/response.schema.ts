import { z } from "@hono/zod-openapi";
import { ArticleSchema } from "../article.schema.ts";
import { EmailSchema } from "../email.schema.ts";
import { PdfSchema } from "../pdf.schema.ts";

export const ItemResponseSchema = z
  .union([ArticleSchema, EmailSchema, PdfSchema])
  .openapi("ItemResponse");

export const ItemListResponseSchema = z
  .array(ItemResponseSchema)
  .openapi("ItemListResponse");
