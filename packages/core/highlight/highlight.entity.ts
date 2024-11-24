import type { BaseEntity, UserScoped } from "@kairos/shared/types";
import type { HighlightColor } from "@kairos/shared/constants";

export interface Highlight extends BaseEntity, UserScoped {
  itemId: string;
  color: HighlightColor;
  textSelection: {
    start: number;
    end: number;
    selectedText: string;
  };
  note: string | null; // Optional note/comment on the highlight
}

export const HIGHLIGHT_FILTERABLE_FIELDS = ["color", "note", "text"] as const;
export const HIGHLIGHT_SORTABLE_FIELDS = [
  "color",
  "note",
  "text",
  "createdAt",
  "updatedAt",
] as const;

export type HighlightFilterableFields =
  (typeof HIGHLIGHT_FILTERABLE_FIELDS)[number];
export type HighlightSortableFields =
  (typeof HIGHLIGHT_SORTABLE_FIELDS)[number];
