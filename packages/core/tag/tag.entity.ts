import type {
  BaseEntity,
  FilterConfig,
  UserScoped,
} from "@kairos/shared/types";
import type { TagColor } from "@kairos/shared/constants";

export interface Tag extends BaseEntity, UserScoped {
  name: string;
  color: TagColor | null;
}

export const TAG_FILTERABLE_FIELDS = [
  "name",
  "color",
  "createdAt",
  "updatedAt",
] as const;

export const TAG_SORTABLE_FIELDS = [
  "name",
  "color",
  "createdAt",
  "updatedAt",
] as const;

export type TagFilterableFields = (typeof TAG_FILTERABLE_FIELDS)[number];
export type TagSortableFields = (typeof TAG_SORTABLE_FIELDS)[number];

export type TagFilterConfig = FilterConfig<TagFilterableFields>;
