import { TagService } from "@core/tag/tag.service.ts";
import { DeleteParams } from "@shared/types/params/mod.ts";

export class DeleteTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: DeleteParams): Promise<void> {
    return this.tagService.delete(params);
  }
}
