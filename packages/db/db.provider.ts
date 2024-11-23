import type {
  CollectionRepository,
  HighlightRepository,
  ItemRepository,
  TagRepository,
  UserRepository,
} from "@kairos/core";
import type { Container, Module } from "@kairos/di";
import { DB_TOKENS } from "@kairos/di/tokens";
import type { ItemContent } from "@kairos/shared/types/common";
import { type Database, db } from "./connection.ts";
import { DrizzleUserRepository } from "./drizzle/repository/user.repository.ts";
import { DrizzleCollectionRepository } from "./drizzle/repository/collection.repository.ts";
import { DrizzleHighlightRepository } from "./drizzle/repository/highlight.repository.ts";
import { DrizzleItemRepository } from "./drizzle/repository/item.repository.ts";
import { DrizzleTagRepository } from "./drizzle/repository/tag.repository.ts";

export class DbModule implements Module {
  register(container: Container): void {
    container.registerSingleton<Database>(DB_TOKENS.Database, () => db);

    container.registerSingleton<CollectionRepository>(
      DB_TOKENS.CollectionRepository,
      () => {
        const db = container.resolve<Database>(DB_TOKENS.Database);
        return new DrizzleCollectionRepository(db);
      },
    );

    container.registerSingleton<HighlightRepository>(
      DB_TOKENS.HighlightRepository,
      () => {
        const db = container.resolve<Database>(DB_TOKENS.Database);
        return new DrizzleHighlightRepository(db);
      },
    );

    container.registerSingleton<ItemRepository<ItemContent>>(
      DB_TOKENS.ItemRepository,
      () => {
        const db = container.resolve<Database>(DB_TOKENS.Database);
        return new DrizzleItemRepository(db);
      },
    );

    container.registerSingleton<TagRepository>(DB_TOKENS.TagRepository, () => {
      const db = container.resolve<Database>(DB_TOKENS.Database);
      return new DrizzleTagRepository(db);
    });

    container.registerSingleton<UserRepository>(
      DB_TOKENS.UserRepository,
      () => {
        const db = container.resolve<Database>(DB_TOKENS.Database);
        return new DrizzleUserRepository(db);
      },
    );
  }
}
