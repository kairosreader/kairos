import type { Container, Module } from "@kairos/di";
import { AUTH_TOKENS } from "@kairos/di/tokens";
import { KratosIdentityService } from "./services/kratos.service.ts";

export class AuthModule implements Module {
  register(container: Container): void {
    container.registerSingleton(AUTH_TOKENS.IdentityService, () => {
      return new KratosIdentityService();
    });
  }
}
