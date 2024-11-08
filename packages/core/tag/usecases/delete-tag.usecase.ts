import type { DeleteParams } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";

export class DeleteTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: DeleteParams): Promise<void> {
    return this.tagService.delete(params);
  }
}
