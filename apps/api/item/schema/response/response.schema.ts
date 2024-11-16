import { z } from "@hono/zod-openapi";
import { ArticleSchema } from "../article.schema.ts";
import { EmailSchema } from "../email.schema.ts";
import { PdfSchema } from "../pdf.schema.ts";

export const ItemResponseSchema = z
  .union([ArticleSchema, EmailSchema, PdfSchema])
  .openapi("ItemResponse");

export const PageInfoSchema = z.object({
  hasNextPage: z.boolean().openapi({
    description: "Whether there are more items after this page",
    example: true,
  }),
  hasPreviousPage: z.boolean().openapi({
    description: "Whether there are more items before this page",
    example: false,
  }),
  totalCount: z.number().int().min(0).openapi({
    description: "Total number of items matching the query",
    example: 100,
  }),
  cursor: z.string().optional().openapi({
    description: "Cursor for the next page when using cursor-based pagination",
    example: "eyJpZCI6IjEyMyJ9",
  }),
}).openapi("PageInfo");

export const ItemListResponseSchema = z.object({
  items: z.array(ItemResponseSchema).openapi({
    description: "List of items",
  }),
  pageInfo: PageInfoSchema,
}).openapi("ItemListResponse");

export type ItemResponse = z.infer<typeof ItemResponseSchema>;
export type ItemListResponse = z.infer<typeof ItemListResponseSchema>;
