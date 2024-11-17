import { TAG_COLOR } from "@kairos/shared/constants";
import { CreateTagRequestSchema } from "./create.schema.ts";

export const UpdateTagRequestSchema = CreateTagRequestSchema.partial().openapi({
  example: {
    name: "programming",
    color: TAG_COLOR.BLUE,
  },
  description: "Partial update for the tag",
});
