import { z } from "@hono/zod-openapi";

export const urlSchema = z.string().url();
