import { z } from "@hono/zod-openapi";
import {
  createQuerySchema,
  type FilterFieldsConfig,
} from "../../../common/schema/pagination.schema.ts";
import { ITEM_SORTABLE_FIELDS, type ItemFilterableFields } from "@kairos/core";

const itemFilterConfig: FilterFieldsConfig<ItemFilterableFields> = {
  title: {
    operators: ["eq", "contains"],
    type: z.string(),
  },
  tags: {
    operators: ["eq", "in", "nin"],
    type: z.array(z.string()),
  },
  type: {
    operators: ["eq"],
    type: z.string(),
  },
  status: {
    operators: ["eq"],
    type: z.string(),
  },
  createdAt: {
    operators: ["eq", "gt", "lt", "gte", "lte"],
    type: z.string(),
  },
  updatedAt: {
    operators: ["eq", "gt", "lt", "gte", "lte"],
    type: z.string(),
  },
};

export const ItemQuerySchema = createQuerySchema({
  sortFields: [...ITEM_SORTABLE_FIELDS],
  filterConfig: itemFilterConfig,
});
