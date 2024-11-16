import { createQuerySchema } from "../../../common/schema/pagination.schema.ts";
import { ITEM_FILTERABLE_FIELDS, ITEM_SORTABLE_FIELDS } from "@kairos/core";

export const ItemQuerySchema = createQuerySchema({
  sortFields: [...ITEM_SORTABLE_FIELDS],
  filterFields: [...ITEM_FILTERABLE_FIELDS],
});
