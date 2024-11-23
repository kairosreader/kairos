import type { Container, Module } from "@kairos/di";
import { DB_TOKENS, USECASES_TOKENS } from "@kairos/di/tokens";
import { TagService } from "@kairos/core/tag";
import type { TagRepository } from "@kairos/core/tag";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared";

export class TagServicesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Tag.TagService,
      () => {
        const tagRepository = container.resolve<TagRepository>(
          DB_TOKENS.TagRepository,
        );
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new TagService(tagRepository, itemService);
      },
    );
  }
}
