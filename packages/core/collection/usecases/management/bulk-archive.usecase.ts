import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { BulkArchiveItemsParams } from "@shared/types/params/mod.ts";

export class BulkArchiveUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: BulkArchiveItemsParams): Promise<void> {
    return this.itemManagementService.bulkArchiveitems(params);
  }
}
