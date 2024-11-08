import type { ItemArchiveOperation } from "@kairos/shared/types/params";
import type { ItemManagementService } from "../../item-management.service.ts";

export class ArchiveItemUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: ItemArchiveOperation): Promise<void> {
    return this.itemManagementService.archiveItem(params);
  }
}
