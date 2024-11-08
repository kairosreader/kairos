import type { BaseEntity, ItemInfo, UserScoped } from "@kairos/shared/types";
import type { HighlightColor } from "@kairos/shared/constants";

export interface Highlight extends BaseEntity, UserScoped {
  itemInfo: ItemInfo;
  userId: string;
  color: HighlightColor;
  textSelection: {
    start: number;
    end: number;
    selectedText: string;
  };
  note?: string; // Optional note/comment on the highlight
}
