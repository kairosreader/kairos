import { createQuerySchema } from "../../../common/schema/pagination.schema.ts";
import {
  COLLECTION_FILTERABLE_FIELDS,
  COLLECTION_SORTABLE_FIELDS,
} from "@kairos/core";

export const CollectionQuerySchema = createQuerySchema({
  sortFields: [...COLLECTION_SORTABLE_FIELDS],
  filterFields: [...COLLECTION_FILTERABLE_FIELDS],
});
