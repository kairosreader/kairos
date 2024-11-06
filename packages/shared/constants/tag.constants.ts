export const TAG_COLOR = {
  YELLOW: "yellow",
  GREEN: "green",
  BLUE: "blue",
  PURPLE: "purple",
  PINK: "pink",
};

export type TagColor = (typeof TAG_COLOR)[keyof typeof TAG_COLOR];
