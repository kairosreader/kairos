import type { BaseEntity, UserScoped } from "@kairos/shared/types/common";

export interface Collection extends BaseEntity, UserScoped {
  name: string;
  description?: string;
  isDefault: boolean;
  isArchive: boolean;
  color?: string;
  icon?: string;
  itemCount: number;
}
