import { HighlightColor } from "@shared/constants/mod.ts";
import { BaseEntity, ItemInfo, UserScoped } from "@shared/types/common/mod.ts";

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
