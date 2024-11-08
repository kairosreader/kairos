import { z } from "@hono/zod-openapi";
import { ITEM_TYPE } from "@kairos/shared/constants";
import { ArticleContentSchema } from "../article.schema.ts";
import { EmailContentSchema } from "../email.schema.ts";
import { PdfContentSchema } from "../pdf.schema.ts";

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
