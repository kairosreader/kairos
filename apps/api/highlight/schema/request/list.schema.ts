import { z } from "@hono/zod-openapi";
import {
  HIGHLIGHT_SORTABLE_FIELDS,
  type HighlightFilterableFields,
} from "@kairos/core";
import {
  createQuerySchema,
  type FilterFieldsConfig,
} from "../../../common/schema/pagination.schema.ts";

const highlightFilterConfig: FilterFieldsConfig<HighlightFilterableFields> = {
  color: {
    operators: ["eq"],
    type: z.string(),
  },
  note: {
    operators: ["eq", "contains"],
    type: z.string(),
  },
  text: {
    operators: ["eq", "contains"],
    type: z.string(),
  },
};

export const HighlightQuerySchema = createQuerySchema({
  sortFields: [...HIGHLIGHT_SORTABLE_FIELDS],
  filterConfig: highlightFilterConfig,
});
