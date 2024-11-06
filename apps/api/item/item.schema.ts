import { z } from "@hono/zod-openapi";
import { ITEM_STATUS, ITEM_TYPE } from "@shared/constants/item.constants.ts";
import {
  dateSchema,
  timestampSchema,
  urlSchema,
} from "../common/common.schema.ts";

const ArticleContentSchema = z.object({
  url: urlSchema.openapi({ example: "https://example.com/article" }),
  content: z.string().openapi({ example: "Article content..." }),
  author: z.string().optional().openapi({ example: "John Doe" }),
  publishedAt: dateSchema.optional(),
});

const EmailContentSchema = z.object({
  from: z.string().email().openapi({ example: "sender@example.com" }),
  to: z
    .array(z.string().email())
    .openapi({ example: ["recipient@example.com"] }),
  subject: z.string().openapi({ example: "Email Subject" }),
  content: z.string().openapi({ example: "Email content..." }),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: urlSchema,
      }),
    )
    .optional(),
});

const PdfMetadataSchema = z
  .object({
    author: z.string().optional(),
    createdAt: timestampSchema.optional(),
    title: z.string().optional(),
  })
  .optional();

const PdfContentSchema = z.object({
  url: urlSchema.openapi({ example: "https://example.com/document.pdf" }),
  pageCount: z.number().openapi({ example: 10 }),
  metadata: PdfMetadataSchema,
});

// We can also extract the base item fields for reuse
const BaseFields = {
  id: z.string().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  type: z.enum([ITEM_TYPE.ARTICLE, ITEM_TYPE.EMAIL, ITEM_TYPE.PDF]).openapi({
    example: ITEM_TYPE.ARTICLE,
  }),
  status: z
    .enum([
      ITEM_STATUS.PENDING,
      ITEM_STATUS.PROCESSING,
      ITEM_STATUS.READY,
      ITEM_STATUS.FAILED,
    ])
    .openapi({ example: ITEM_STATUS.READY }),
  title: z.string().openapi({ example: "Example Article" }),
  excerpt: z.string().optional().openapi({ example: "Article excerpt..." }),
  coverImage: urlSchema
    .optional()
    .openapi({ example: "https://example.com/image.jpg" }),
  tags: z.array(z.string()).openapi({ example: ["tech", "programming"] }),
  estimatedReadTime: z.number().optional().openapi({ example: 5 }),
  userId: z.string().openapi({ example: "user123" }),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
} as const;

const BaseItemSchema = z.object(BaseFields);

// Extract content union for reuse
const ContentUnion = z.union([
  ArticleContentSchema,
  EmailContentSchema,
  PdfContentSchema,
]);

export const CreateItemRequestSchema = z
  .object({
    type: BaseFields.type,
    content: ContentUnion,
    tags: BaseFields.tags.optional(),
  })
  .openapi("CreateItemRequest");

export const UpdateItemRequestSchema = z
  .object({
    title: BaseFields.title.optional(),
    excerpt: BaseFields.excerpt,
    tags: BaseFields.tags.optional(),
    content: ContentUnion.optional(),
  })
  .openapi("UpdateItemRequest");

export const ItemResponseSchema = BaseItemSchema.extend({
  content: ContentUnion,
}).openapi("ItemResponse");

export const ItemListResponseSchema = z
  .array(ItemResponseSchema)
  .openapi("ItemListResponse");

export const ItemParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: "id",
      in: "path",
    },
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
});

export const AuthHeadersSchema = z.object({
  authorization: z.string().openapi({
    param: {
      name: "authorization",
      in: "header",
      required: true,
      description: "Bearer token for authentication",
    },
    example: "Bearer eyJhbGciOiJIUzI1NiIsIn...",
  }),
});
