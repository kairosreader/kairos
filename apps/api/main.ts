import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import {
  TsyringeContainer,
  configureContainer,
  TOKENS,
} from "@kairos/infra/di";
import { ItemController } from "./item/item.controller.ts";
import type { AppEnv } from "./common/controller/controller.types.ts";

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

const app = new OpenAPIHono<AppEnv>();
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

// Register routes
app.route("/api", itemController.register());

// OpenAPI documentation
app.doc("/api", {
  openapi: "3.0.0",
  info: {
    title: "Reading List API",
    version: "1.0.0",
    description: "API for managing reading list items",
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
