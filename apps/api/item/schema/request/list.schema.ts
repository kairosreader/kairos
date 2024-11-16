import { z } from "@hono/zod-openapi";
import { ITEM_STATUS, ITEM_TYPE } from "@kairos/shared/constants";
import {
  filterSchema,
  paginationSchema,
  sortSchema,
} from "../../../common/schema/pagination.schema.ts";

const itemFilterableFields = [
  "title",
  "type",
  "status",
  "createdAt",
  "updatedAt",
] as const;
const itemSortableFields = ["title", "createdAt", "updatedAt"] as const;

export const ListItemsQuerySchema = z
  .object({
    pagination: paginationSchema.openapi({
      description: "Pagination options",
    }),
    sort: sortSchema
      .extend({
        field: z.enum(itemSortableFields),
      })
      .optional()
      .openapi({
        description: "Sort options",
      }),
    filter: z
      .record(z.enum(itemFilterableFields), filterSchema)
      .optional()
      .openapi({
        description: "Filter options",
        example: {
          type: {
            eq: ITEM_TYPE.ARTICLE,
          },
          status: {
            eq: ITEM_STATUS.READY,
          },
        },
      }),
  })
  .openapi("ListItemsQuery");

export type ListItemsQuery = z.infer<typeof ListItemsQuerySchema>;
