import type { HighlightColor } from "../../constants/highlight.constants.ts";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: number;
  lineSpacing: number;
  defaultHighlightColor: HighlightColor;
}
