import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { MoveItemParams } from "@shared/types/params/mod.ts";

export class MoveItemUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: MoveItemParams): Promise<void> {
    return this.itemManagementService.moveItem(params);
  }
}
