import { Env, ContextVariableMap } from "@hono/hono";

export interface ValidationResult {
  success: boolean;
  error?: {
    message: string;
    errors?: unknown[];
  };
}

export interface AppVariables {
  userId: string;
}

export interface AppEnv extends Env {
  Variables: ContextVariableMap & {
    userId: string;
  };
}
