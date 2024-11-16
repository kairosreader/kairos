import { TAG_FILTERABLE_FIELDS, TAG_SORTABLE_FIELDS } from "@kairos/core";
import { createQuerySchema } from "../../../common/schema/pagination.schema.ts";

export const TagQuerySchema = createQuerySchema({
  sortFields: [...TAG_SORTABLE_FIELDS],
  filterFields: [...TAG_FILTERABLE_FIELDS],
});
