import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { BulkItemArchiveOperation } from "@shared/types/params/mod.ts";

export class BulkArchiveUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: BulkItemArchiveOperation): Promise<void> {
    return this.itemManagementService.bulkArchiveitems(params);
  }
}
