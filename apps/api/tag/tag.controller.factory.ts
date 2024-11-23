import type { Container } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import type {
  BulkTagUseCase,
  CreateTagUseCase,
  DeleteTagUseCase,
  GetTagUseCase,
  ListTagsUseCase,
  MergeTagsUseCase,
  TagItemUseCase,
  UpdateTagUseCase,
} from "@kairos/core/tag";
import { TagController } from "./tag.controller.ts";

export function createTagController(container: Container): TagController {
  return new TagController(
    container.resolve<CreateTagUseCase>(USECASES_TOKENS.Tag.SaveTagUseCase),
    container.resolve<UpdateTagUseCase>(USECASES_TOKENS.Tag.UpdateTagUseCase),
    container.resolve<GetTagUseCase>(USECASES_TOKENS.Tag.GetTagUseCase),
    container.resolve<ListTagsUseCase>(USECASES_TOKENS.Tag.ListItemUseCase),
    container.resolve<DeleteTagUseCase>(USECASES_TOKENS.Tag.DeleteTagUseCase),
    container.resolve<TagItemUseCase>(USECASES_TOKENS.Tag.TagItemUseCase),
    container.resolve<BulkTagUseCase>(USECASES_TOKENS.Tag.BulkTagUseCase),
    container.resolve<MergeTagsUseCase>(USECASES_TOKENS.Tag.MergeTagsUseCase),
  );
}
