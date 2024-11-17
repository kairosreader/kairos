import { CreateCollectionRequestSchema } from "./create.schema.ts";

export const UpdateCollectionRequestSchema = CreateCollectionRequestSchema
  .partial().openapi({
    example: {
      name: "Reading List",
      description: "My main reading list",
      color: "#FF0000",
      icon: "📚",
    },
    description: "Partial update for the collection",
  });
