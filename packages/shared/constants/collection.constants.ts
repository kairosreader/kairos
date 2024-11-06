export const SPECIAL_COLLECTION = {
  RECENT: "recent",
  ARCHIVE: "archive",
} as const;

export type SpecialCollection =
  (typeof SPECIAL_COLLECTION)[keyof typeof SPECIAL_COLLECTION];
