import type { BulkItemArchiveOperation } from "@kairos/shared/types/params";
import type { ItemManagementService } from "../../item-management.service.ts";

export class BulkArchiveUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: BulkItemArchiveOperation): Promise<void> {
    return this.itemManagementService.bulkArchiveitems(params);
  }
}
