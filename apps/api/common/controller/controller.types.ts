import type { ContextVariableMap, Env } from "@hono/hono";

export interface AppEnv extends Env {
  Variables: ContextVariableMap & {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}
