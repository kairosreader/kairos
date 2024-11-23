import type { Container, Module } from "@kairos/di";
import { DB_TOKENS, USECASES_TOKENS } from "@kairos/di/tokens";
import { ItemService } from "@kairos/core/item";
import type { ItemRepository } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared";

export class ItemServicesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(USECASES_TOKENS.Item.ItemService, () => {
      const itemRepository = container.resolve<ItemRepository<ItemContent>>(
        DB_TOKENS.ItemRepository,
      );
      return new ItemService(itemRepository);
    });
  }
}
