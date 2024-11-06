import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { ItemRoutes } from "@api/item/item.route.ts";
import { configureContainer } from "@infra/di/container.config.ts";
import { TOKENS } from "@infra/di/tokens.ts";
import { TsyringeContainer } from "@infra/di/tsyringe/container.ts";

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
const itemRoutes = new ItemRoutes(
  container.resolve(TOKENS.SaveItemUseCase),
  container.resolve(TOKENS.UpdateItemUseCase),
  container.resolve(TOKENS.ItemService),
);

const app = new OpenAPIHono();

// Register routes
app.route("/api", itemRoutes.register());

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
