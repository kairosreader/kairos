export const HIGHLIGHT_COLOR = {
  YELLOW: "yellow",
  GREEN: "green",
  BLUE: "blue",
  PURPLE: "purple",
  PINK: "pink",
};

export type HighlightColor =
  (typeof HIGHLIGHT_COLOR)[keyof typeof HIGHLIGHT_COLOR];
