import { z } from "@hono/zod-openapi";
import { dateSchema } from "@api/common/schema/date.schema.ts";
import { urlSchema } from "@api/common/schema/url.schema.ts";
import { baseItemFields } from "./item.schema.ts";
import { ITEM_TYPE } from "@shared/constants/mod.ts";

export const PdfMetadataSchema = z
  .object({
    author: z.string().optional(),
    createdAt: dateSchema,
    title: z.string().optional(),
  })
  .optional();

export const PdfContentSchema = z
  .object({
    url: urlSchema,
    pageCount: z.number(),
    metadata: PdfMetadataSchema,
  })
  .openapi("PdfContent");

export const PdfSchema = z.object({
  ...baseItemFields,
  type: z.literal(ITEM_TYPE.PDF),
  content: PdfContentSchema,
});

export const CreatePdfRequestSchema = z.object({
  type: z.literal(ITEM_TYPE.PDF),
  content: PdfContentSchema,
});

export const UpdatePdfContentSchema = z.object({
  type: z.literal(ITEM_TYPE.PDF),
  content: PdfContentSchema.partial(),
});
