import { z } from "@hono/zod-openapi";
import { ArticleContentSchema } from "../article.schema.ts";
import { EmailContentSchema } from "../email.schema.ts";
import { PdfContentSchema } from "../pdf.schema.ts";
import { ItemTagSchema } from "../item.schema.ts";
import { TAG_COLOR } from "@kairos/shared";

export const UpdateItemRequestSchema = z
  .object({
    title: z.string().optional().openapi({
      example: "Updated Title",
      description: "New title for the item",
    }),
    excerpt: z.string().optional().openapi({
      example: "Updated excerpt...",
      description: "New excerpt for the item",
    }),
    content: z
      .union([ArticleContentSchema, EmailContentSchema, PdfContentSchema])
      .optional(),
    tags: z
      .array(ItemTagSchema)
      .optional()
      .openapi({
        example: [
          {
            id: "b7a0d715-3960-4335-98f8-39808c5b3a14",
            name: "Reading List",
            color: TAG_COLOR.YELLOW,
          },
        ],
        description: "Tags for the item",
      }),
    coverImage: z.string().url().optional().openapi({
      example: "https://example.com/image.jpg",
      description: "URL of the cover image",
    }),
    estimatedReadTime: z.number().int().min(0).optional().openapi({
      example: 5,
      description: "Estimated reading time in minutes",
    }),
  })
  .openapi("UpdateItemRequest");

export type UpdateItemRequest = z.infer<typeof UpdateItemRequestSchema>;
