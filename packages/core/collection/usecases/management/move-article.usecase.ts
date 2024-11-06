import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { MoveItemParams } from "@shared/types/params/collection.params.ts";

export class MoveArticleUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: MoveItemParams): Promise<void> {
    return this.itemManagementService.moveItem(params);
  }
}
