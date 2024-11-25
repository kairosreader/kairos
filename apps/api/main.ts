import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import type { AppEnv } from "./common/controller/controller.types.ts";
import { configureContainer } from "./container.config.ts";
import { createItemController } from "./item/item.controller.factory.ts";
import { createCollectionController } from "./collection/collection.controller.factory.ts";
import { createTagController } from "./tag/tag.controller.factory.ts";
import { createHighlightController } from "./highlight/highlight.controller.factory.ts";
import { createUserController } from "./user/user.controller.factory.ts";

const container = configureContainer({
  redis: {
    host: Deno.env.get("REDIS_HOST") || "localhost",
    port: parseInt(Deno.env.get("REDIS_PORT") || "6379"),
    password: Deno.env.get("REDIS_PASSWORD"),
  },
});

// Initialize controllers using factories
const itemController = createItemController(container);
const collectionController = createCollectionController(container);
const tagController = createTagController(container);
const highlightController = createHighlightController(container);
const userController = createUserController(container);

const app = new OpenAPIHono<AppEnv>({
  strict: false,
});

// OpenAPI documentation
app.doc("/api/doc", {
  openapi: "3.0.0",
  info: {
    title: "Kairos",
    version: "0.0.0",
    description: "OpenAPI documentation for Kairos API",
  },
  servers: [
    {
      url: `/`,
      description: "Local development server",
    },
  ],
});

// Swagger UI
app.get("/api/swagger", swaggerUI({ url: "/api/doc" }));

// Register routes
app.route("/api", itemController.register());
app.route("/api", collectionController.register());
app.route("/api", tagController.register());
app.route("/api", highlightController.register());
app.route("/api", userController.register());

// Add a catch-all handler with logging
app.all("*", (c) => {
  console.log("API 404:", c.req.url);
  return c.json({ error: "Not Found", path: c.req.url }, 404);
});

Deno.serve({ port: 3000 }, app.fetch);
