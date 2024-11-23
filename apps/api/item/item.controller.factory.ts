import type { Container } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import type {
  BulkDeleteItemsUseCase,
  DeleteItemUseCase,
  GetItemUseCase,
  ListItemsUseCase,
  SaveItemUseCase,
  UpdateItemUseCase,
  UpdateReadingProgressUseCase,
} from "@kairos/core/item";
import { ItemController } from "./item.controller.ts";

export function createItemController(container: Container): ItemController {
  return new ItemController(
    container.resolve<SaveItemUseCase>(USECASES_TOKENS.Item.SaveItemUseCase),
    container.resolve<UpdateItemUseCase>(
      USECASES_TOKENS.Item.UpdateItemUseCase,
    ),
    container.resolve<GetItemUseCase>(USECASES_TOKENS.Item.GetItemUseCase),
    container.resolve<ListItemsUseCase>(USECASES_TOKENS.Item.ListItemsUseCase),
    container.resolve<UpdateReadingProgressUseCase>(
      USECASES_TOKENS.Item.UpdateReadingProgressUseCase,
    ),
    container.resolve<DeleteItemUseCase>(
      USECASES_TOKENS.Item.DeleteItemUseCase,
    ),
    container.resolve<BulkDeleteItemsUseCase>(
      USECASES_TOKENS.Item.BulkDeleteItemsUseCase,
    ),
  );
}
