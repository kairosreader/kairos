import { DeleteTagParams } from "@shared/types/params/mod.ts";
import { TagService } from "@core/tag/tag.service.ts";

export class DeleteTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: DeleteTagParams): Promise<void> {
    return this.tagService.delete({
      id: params.tagName,
      userId: params.userId,
    });
  }
}
