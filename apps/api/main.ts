import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import {
  TsyringeContainer,
  configureContainer,
  TOKENS,
} from "@kairos/infra/di";
import { ItemController } from "./item/item.controller.ts";
import { CollectionController } from "./collection/collection.controller.ts";
import type { AppEnv } from "./common/controller/controller.types.ts";
import { TagController } from "./tag/tag.controller.ts";

const container = new TsyringeContainer();
// Configure container
configureContainer(container, {
  redis: {
    host: Deno.env.get("REDIS_HOST") || "localhost",
    port: parseInt(Deno.env.get("REDIS_PORT") || "6379"),
    password: Deno.env.get("REDIS_PASSWORD"),
  },
});

// Initialize controller with dependencies
const itemController = new ItemController(
  container.resolve(TOKENS.SaveItemUseCase),
  container.resolve(TOKENS.UpdateItemUseCase),
  container.resolve(TOKENS.GetItemUseCase),
  container.resolve(TOKENS.ListItemsUseCase),
  container.resolve(TOKENS.UpdateReadingProgressUseCase),
  container.resolve(TOKENS.DeleteItemUseCase),
  container.resolve(TOKENS.BulkDeleteItemsUseCase),
);

const collectionController = new CollectionController(
  container.resolve(TOKENS.CreateCollectionUseCase),
  container.resolve(TOKENS.UpdateCollectionUseCase),
  container.resolve(TOKENS.GetCollectionUseCase),
  container.resolve(TOKENS.ListCollectionsUseCase),
  container.resolve(TOKENS.DeleteCollectionUseCase),
  container.resolve(TOKENS.AddToCollectionUseCase),
  container.resolve(TOKENS.RemoveFromCollectionUseCase),
  container.resolve(TOKENS.MoveItemUseCase),
  container.resolve(TOKENS.ArchiveItemUseCase),
  container.resolve(TOKENS.BulkArchiveUseCase),
);

const tagController = new TagController(
  container.resolve(TOKENS.CreateTagUseCase),
  container.resolve(TOKENS.UpdateTagUseCase),
  container.resolve(TOKENS.GetTagUseCase),
  container.resolve(TOKENS.ListTagsUseCase),
  container.resolve(TOKENS.DeleteTagUseCase),
  container.resolve(TOKENS.TagItemUseCase),
  container.resolve(TOKENS.BulkTagUseCase),
  container.resolve(TOKENS.MergeTagsUseCase),
);

const app = new OpenAPIHono<AppEnv>();
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

// Register routes
app.route("/api", itemController.register());
app.route("/api", collectionController.register());
app.route("/api", tagController.register());

// OpenAPI documentation
app.doc("/api", {
  openapi: "3.0.0",
  info: {
    title: "Kairos",
    version: "0.0.0",
    description: "OpenAPI documentation for Kairos API",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],
});

app.get("/swagger", swaggerUI({ url: "/api" }));

// Error handling middleware could be added here

Deno.serve(app.fetch);
