import { z } from "@hono/zod-openapi";
import {
  createQuerySchema,
  type FilterFieldsConfig,
} from "../../../common/schema/pagination.schema.ts";
import {
  COLLECTION_SORTABLE_FIELDS,
  type CollectionFilterableFields,
} from "@kairos/core";

const collectionFilterConfig: FilterFieldsConfig<CollectionFilterableFields> = {
  name: {
    operators: ["eq", "contains"],
    type: z.string(),
  },
  description: {
    operators: ["eq", "contains"],
    type: z.string(),
  },
  isDefault: {
    operators: ["eq"],
    type: z.boolean(),
  },
  isArchive: {
    operators: ["eq"],
    type: z.boolean(),
  },
  itemCount: {
    operators: ["eq", "gt", "lt", "gte", "lte"],
    type: z.number(),
  },
};

export const CollectionQuerySchema = createQuerySchema({
  sortFields: [...COLLECTION_SORTABLE_FIELDS],
  filterConfig: collectionFilterConfig,
});
