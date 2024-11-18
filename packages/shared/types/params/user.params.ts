import type { UserPreferences } from "../common/user.types.ts";

export interface CreateUserParams {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}
