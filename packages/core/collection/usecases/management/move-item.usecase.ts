import type { MoveItemOperation } from "@kairos/shared/types/params";
import type { ItemManagementService } from "../../item-management.service.ts";

export class MoveItemUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: MoveItemOperation): Promise<void> {
    return this.itemManagementService.moveItem(params);
  }
}
