import { z } from "@hono/zod-openapi";
import { TAG_SORTABLE_FIELDS, type TagFilterableFields } from "@kairos/core";
import {
  createQuerySchema,
  type FilterFieldsConfig,
} from "../../../common/schema/pagination.schema.ts";

const tagFilterConfig: FilterFieldsConfig<TagFilterableFields> = {
  name: {
    operators: ["eq", "contains"],
    type: z.string(),
  },
  color: {
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

export const TagQuerySchema = createQuerySchema({
  sortFields: [...TAG_SORTABLE_FIELDS],
  filterConfig: tagFilterConfig,
});
