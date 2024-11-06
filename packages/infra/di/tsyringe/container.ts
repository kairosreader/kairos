import { container, instanceCachingFactory, singleton } from "tsyringe";
import { Container } from "@core/di/container.ts";

@singleton()
export class TsyringeContainer implements Container {
  register<T>(token: string, factory: () => T): void {
    container.register(token, {
      useFactory: factory,
    });
  }

  registerSingleton<T>(token: string, factory: () => T): void {
    container.register(token, {
      useFactory: instanceCachingFactory<T>(factory),
    });
  }

  resolve<T>(token: string): T {
    return container.resolve(token);
  }
}
