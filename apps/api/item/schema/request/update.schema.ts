import { z } from "@hono/zod-openapi";
import { ArticleContentSchema } from "../article.schema.ts";
import { EmailContentSchema } from "../email.schema.ts";
import { PdfContentSchema } from "../pdf.schema.ts";

export const UpdateItemRequestSchema = z
  .object({
    title: z.string().openapi({
      example: "Updated Title",
      description: "New title for the item",
    }),
    excerpt: z.string().optional().openapi({
      example: "Updated excerpt...",
      description: "New excerpt for the item",
    }),
    content: z.union([
      ArticleContentSchema,
      EmailContentSchema,
      PdfContentSchema,
    ]),
    tags: z.array(z.string()).openapi({
      example: ["tech", "programming"],
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
