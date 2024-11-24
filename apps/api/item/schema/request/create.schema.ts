import { z } from "@hono/zod-openapi";
import { ITEM_TYPE, TAG_COLOR } from "@kairos/shared/constants";
import { ArticleContentSchema } from "../article.schema.ts";
import { EmailContentSchema } from "../email.schema.ts";
import { PdfContentSchema } from "../pdf.schema.ts";
import { enumValuesTuple } from "@kairos/shared/utils";
import { ItemTagSchema } from "../item.schema.ts";

export const CreateItemRequestSchema = z
  .object({
    type: z.enum(enumValuesTuple(ITEM_TYPE)),
    content: z.union([
      ArticleContentSchema,
      EmailContentSchema,
      PdfContentSchema,
    ]),
    tags: z
      .array(ItemTagSchema)
      .nullish()
      .transform((val) => val || [])
      .openapi({
        example: [
          {
            id: "b7a0d715-3960-4335-98f8-39808c5b3a14",
            name: "Reading List",
            color: TAG_COLOR.YELLOW,
          },
        ],
        description: "Optional tags for the item",
      }),
  })
  .openapi({
    example: {
      type: ITEM_TYPE.ARTICLE,
      content: {
        url: "https://example.com/article",
      },
      tags: [
        {
          id: "b7a0d715-3960-4335-98f8-39808c5b3a14",
          name: "Reading List",
          color: TAG_COLOR.YELLOW,
        },
      ],
    },
  });

export type CreateItemRequest = z.infer<typeof CreateItemRequestSchema>;
