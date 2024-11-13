import { z } from "@hono/zod-openapi";
import { itemInfoSchema } from "../../../item/schema/item.schema.ts";

export const AddToCollectionRequestSchema = z.object({
  itemInfo: itemInfoSchema.openapi({
    description: "Information about the item to add",
  }),
});

export const RemoveFromCollectionRequestSchema = z.object({
  itemInfo: itemInfoSchema.openapi({
    description: "Information about the item to remove",
  }),
});

export const MoveItemRequestSchema = z.object({
  itemInfo: itemInfoSchema.openapi({
    description: "Information about the item to move",
  }),
  toCollectionId: z.string().openapi({
    description: "ID of the target collection",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  removeFromOtherCollections: z.boolean().optional().openapi({
    description: "Whether to remove the item from other collections",
    example: true,
  }),
});

export const ArchiveItemRequestSchema = z.object({
  itemInfo: itemInfoSchema.openapi({
    description: "Information about the item to archive",
  }),
});

export const BulkArchiveRequestSchema = z.object({
  itemInfos: z.array(itemInfoSchema).openapi({
    description: "Information about the items to archive",
  }),
});
