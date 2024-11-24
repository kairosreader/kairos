import type { BaseEntity, UserScoped } from "@kairos/shared/types/common";

export interface Collection extends BaseEntity, UserScoped {
  name: string;
  description: string | null;
  isDefault: boolean;
  isArchive: boolean;
  color: string | null;
  icon: string | null;
  itemCount: number;
}

export const COLLECTION_FILTERABLE_FIELDS = [
  "name",
  "description",
  "isDefault",
  "isArchive",
  "itemCount",
] as const;

export const COLLECTION_SORTABLE_FIELDS = [
  "name",
  "description",
  "isDefault",
  "isArchive",
  "color",
  "icon",
  "itemCount",
] as const;

export type CollectionFilterableFields =
  typeof COLLECTION_FILTERABLE_FIELDS[number];
export type CollectionSortableFields =
  typeof COLLECTION_SORTABLE_FIELDS[number];
