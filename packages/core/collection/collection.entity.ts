import { BaseEntity, UserScoped } from "@shared/types/common/mod.ts";

export interface Collection extends BaseEntity, UserScoped {
  name: string;
  description?: string;
  isDefault: boolean;
  isArchive: boolean;
  color?: string;
  icon?: string;
  itemCount: number;
}
