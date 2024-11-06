import { BaseEntity, UserScoped } from "@shared/types/common/mod.ts";
import { TagColor } from "@shared/constants/mod.ts";

export interface Tag extends BaseEntity, UserScoped {
  name: string;
  color?: TagColor;
}
