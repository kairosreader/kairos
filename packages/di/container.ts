import "reflect-metadata";
import { container, instanceCachingFactory, singleton } from "tsyringe";

@singleton()
export class Container {
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
