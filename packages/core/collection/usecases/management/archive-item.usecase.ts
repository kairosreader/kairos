import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { ItemArchiveOperation } from "@shared/types/params/mod.ts";

export class ArchiveItemUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: ItemArchiveOperation): Promise<void> {
    return this.itemManagementService.archiveItem(params);
  }
}
