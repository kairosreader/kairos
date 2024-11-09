import { z } from "@hono/zod-openapi";
import { baseItemFields } from "./item.schema.ts";
import { dateSchema } from "../../common/schema/date.schema.ts";
import { urlSchema } from "../../common/schema/url.schema.ts";
import { ITEM_TYPE } from "@kairos/shared/constants";

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
