import type { Container } from "@kairos/core";
import { TOKENS } from "../tokens.ts";
import { type Database, db } from "../../db/connection.ts";

export function configureDbContainer(container: Container) {
  // Services
  container.registerSingleton<Database>(TOKENS.DbClient, () => db);
}
