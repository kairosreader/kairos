import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { MoveItemOperation } from "@shared/types/params/mod.ts";

export class MoveItemUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: MoveItemOperation): Promise<void> {
    return this.itemManagementService.moveItem(params);
  }
}
