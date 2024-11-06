import { HighlightColor } from "@shared/constants/mod.ts";

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: number;
  lineSpacing: number;
  syncEnabled: boolean;
  notificationsEnabled: boolean;
  defaultHighlightColor: HighlightColor;
  defaultReadingListId?: string;
}
