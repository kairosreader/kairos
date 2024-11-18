import { UserSchema } from "../user.schema.ts";

export const UserResponseSchema = UserSchema.openapi("UserResponse");
