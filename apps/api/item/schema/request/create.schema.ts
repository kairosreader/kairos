import { z } from "@hono/zod-openapi";
import { ITEM_TYPE } from "@kairos/shared/constants";
import { ArticleContentSchema } from "../article.schema.ts";
import { EmailContentSchema } from "../email.schema.ts";
import { PdfContentSchema } from "../pdf.schema.ts";
import { enumValuesTuple } from "@kairos/shared/utils";

export const CreateItemRequestSchema = z
  .object({
    type: z.enum(enumValuesTuple(ITEM_TYPE)),
    content: z.union([
      ArticleContentSchema,
      EmailContentSchema,
      PdfContentSchema,
    ]),
    tags: z
      .array(z.string())
      .nullish()
      .transform((val) => val || null)
      .openapi({
        example: ["b7a0d715-3960-4335-98f8-39808c5b3a14"],
        description: "Optional tag ids for the item",
      }),
  })
  .openapi({
    example: {
      type: ITEM_TYPE.ARTICLE,
      content: {
        url: "https://example.com/article",
      },
      tags: ["b7a0d715-3960-4335-98f8-39808c5b3a14"],
    },
  });

export type CreateItemRequest = z.infer<typeof CreateItemRequestSchema>;
