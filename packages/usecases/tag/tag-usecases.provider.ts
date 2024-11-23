import type { Container, Module } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import {
  BulkTagUseCase,
  CreateTagUseCase,
  DeleteTagUseCase,
  GetTagUseCase,
  ListTagsUseCase,
  MergeTagsUseCase,
  TagItemUseCase,
  type TagService,
  UpdateTagUseCase,
} from "@kairos/core/tag";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared";

export class TagUseCasesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Tag.SaveTagUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new CreateTagUseCase(tagService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.GetTagUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new GetTagUseCase(tagService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.UpdateTagUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new UpdateTagUseCase(tagService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.DeleteTagUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new DeleteTagUseCase(tagService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.ListItemUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new ListTagsUseCase(tagService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.MergeTagsUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new MergeTagsUseCase(tagService, itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.TagItemUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new TagItemUseCase(tagService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Tag.BulkTagUseCase,
      () => {
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        return new BulkTagUseCase(tagService);
      },
    );
  }
}
