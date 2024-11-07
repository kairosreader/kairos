import { ItemInfo } from "@shared/types/common/item.types.ts";
import { HighlightColor } from "@shared/constants/highlight.constants.ts";
import {
  CreateParams,
  SortablePaginatedQuery,
  UpdateParams,
  UserScoped,
} from "@shared/types/params/base.params.ts";

export interface TextSelection {
  start: number;
  end: number;
  selectedText: string;
}

export interface HighlightData {
  itemInfo: ItemInfo;
  color?: HighlightColor;
  textSelection: TextSelection;
  note?: string;
}

export interface CreateHighlightParams extends CreateParams<HighlightData> {}

export interface UpdateHighlightData {
  color: HighlightColor;
  note: string;
}

export interface UpdateHighlightParams
  extends UpdateParams<UpdateHighlightData> {}

export interface ListHighlightsParams
  extends SortablePaginatedQuery,
    UserScoped {
  itemId?: string;
  color?: HighlightColor;
  hasNote?: boolean;
  sortBy?: "createdAt" | "position";
}

export interface BulkDeleteHighlightsOperation extends UserScoped {
  highlightIds: string[];
}
