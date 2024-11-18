import { z } from "@hono/zod-openapi";
import { enumValuesTuple } from "@kairos/shared/utils";
import { HIGHLIGHT_COLOR } from "@kairos/shared/constants";

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).openapi({
    description: "User's preferred theme",
    example: "light",
    enum: ["light", "dark", "system"],
  }),
  fontSize: z.number().openapi({
    description: "User's preferred font size",
    example: 16,
  }),
  lineSpacing: z.number().openapi({
    description: "User's preferred line spacing",
    example: 1.5,
  }),
  defaultHighlightColor: z.enum(enumValuesTuple(HIGHLIGHT_COLOR)).openapi({
    description: "User's preferred default highlight color",
    example: "yellow",
    enum: enumValuesTuple(HIGHLIGHT_COLOR),
  }),
});

export const UserSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    preferences: UserPreferencesSchema,
  })
  .openapi("User");
