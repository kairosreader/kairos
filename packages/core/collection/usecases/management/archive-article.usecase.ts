import { ItemManagementService } from "@core/collection/item-management.service.ts";
import { ArchiveItemParams } from "@shared/types/params/mod.ts";

export class ArchiveArticleUseCase {
  constructor(private itemManagementService: ItemManagementService) {}

  execute(params: ArchiveItemParams): Promise<void> {
    return this.itemManagementService.archiveItem(params);
  }
}
