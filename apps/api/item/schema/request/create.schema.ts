import { z } from "@hono/zod-openapi";
import { ITEM_TYPE } from "@shared/constants/mod.ts";
import { ArticleContentSchema } from "@api/item/schema/article.schema.ts";
import { EmailContentSchema } from "@api/item/schema/email.schema.ts";
import { PdfContentSchema } from "@api/item/schema/pdf.schema.ts";

export const CreateItemRequestSchema = z
  .object({
    type: z.enum([ITEM_TYPE.ARTICLE, ITEM_TYPE.EMAIL, ITEM_TYPE.PDF]),
    content: z.union([
      ArticleContentSchema,
      EmailContentSchema,
      PdfContentSchema,
    ]),
    tags: z
      .array(z.string())
      .optional()
      .openapi({
        example: ["tech", "programming"],
        description: "Optional tags for the item",
      }),
  })
  .openapi("CreateItemRequest");

export type CreateItemRequest = z.infer<typeof CreateItemRequestSchema>;
