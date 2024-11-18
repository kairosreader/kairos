import type { UserPreferences } from "@kairos/shared/types";

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export const USER_FILTERABLE_FIELDS = [
  "email",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export const USER_SORTABLE_FIELDS = [
  "email",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export type UserFilterableFields = (typeof USER_FILTERABLE_FIELDS)[number];
export type UserSortableFields = (typeof USER_SORTABLE_FIELDS)[number];
