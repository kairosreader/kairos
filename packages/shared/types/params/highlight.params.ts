import type { HighlightColor } from "../../constants/highlight.constants.ts";
import type { ItemInfo } from "../common/item.types.ts";
import type {
  CreateParams,
  SortablePaginatedQuery,
  UpdateParams,
  UserScopedParams,
} from "./base.params.ts";

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
  extends SortablePaginatedQuery, UserScopedParams {
  itemId?: string;
  color?: HighlightColor;
  hasNote?: boolean;
  sortBy?: "createdAt" | "position";
}

export interface BulkDeleteHighlightsOperation extends UserScopedParams {
  highlightIds: string[];
}
