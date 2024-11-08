import type { BaseEntity, UserScoped } from "@kairos/shared/types";
import type { TagColor } from "@kairos/shared/constants";

export interface Tag extends BaseEntity, UserScoped {
  name: string;
  color?: TagColor;
}
