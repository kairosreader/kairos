import type { HighlightColor } from "../../constants/highlight.constants.ts";
import type {
  CreateParams,
  UpdateParams,
  UserScopedParams,
} from "./base.params.ts";

export interface TextSelection {
  start: number;
  end: number;
  selectedText: string;
}

export interface HighlightData {
  itemId: string;
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

export interface BulkDeleteHighlightsOperation extends UserScopedParams {
  highlightIds: string[];
}
