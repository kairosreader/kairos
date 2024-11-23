import type { Container } from "./container.ts";

export interface Module {
  register(container: Container): void;
}
