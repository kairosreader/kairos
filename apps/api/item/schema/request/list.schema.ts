import { z } from "@hono/zod-openapi";
import { ITEM_STATUS, ITEM_TYPE } from "@kairos/shared/constants";
import {
  paginationSchema,
  sortSchema,
} from "../../../common/schema/pagination.schema.ts";

export const ListItemsQuerySchema = z
  .object({
    ...paginationSchema.shape,
    ...sortSchema.shape,
    sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional().openapi({
      description: "Field to sort by",
      example: "createdAt",
    }),
    collectionId: z.string().optional().openapi({
      description: "Filter by collection ID",
      example: "collection-123",
    }),
    tags: z
      .array(z.string())
      .optional()
      .openapi({
        description: "Filter by tags",
        example: ["tech", "programming"],
      }),
    type: z
      .enum([ITEM_TYPE.ARTICLE, ITEM_TYPE.EMAIL, ITEM_TYPE.PDF])
      .optional()
      .openapi({
        description: "Filter by item type",
        example: ITEM_TYPE.ARTICLE,
      }),
    status: z
      .enum([
        ITEM_STATUS.PENDING,
        ITEM_STATUS.PROCESSING,
        ITEM_STATUS.READY,
        ITEM_STATUS.FAILED,
      ])
      .optional()
      .openapi({
        description: "Filter by status",
        example: ITEM_STATUS.READY,
      }),
  })
  .openapi("ListItemsQuery");

export type ListItemsQuery = z.infer<typeof ListItemsQuerySchema>;
