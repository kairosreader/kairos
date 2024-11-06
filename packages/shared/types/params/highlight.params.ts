import { HighlightColor } from "@shared/constants/mod.ts";
import { ItemInfo } from "@shared/types/common/mod.ts";

export type CreateHighlightParams = {
  itemInfo: ItemInfo;
  userId: string;
  textSelection: {
    start: number;
    end: number;
    selectedText: string;
  };
  color?: HighlightColor;
  note?: string;
};

export type UpdateHighlightParams = {
  highlightId: string;
  userId: string;
  updates: {
    color?: HighlightColor;
    note?: string;
  };
};

export type DeleteHighlightParams = {
  highlightId: string;
  userId: string;
};

export type BulkDeleteHighlightsParams = {
  highlightIds: string[];
  userId: string;
};

export type VerifyHighlightOwnershipParams = {
  highlightId: string;
  userId: string;
};
