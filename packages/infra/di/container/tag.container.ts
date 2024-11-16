import type { Container } from "@kairos/core/di";
import type { TagRepository } from "@kairos/core/tag";
import { TagService } from "@kairos/core/tag";
import {
  BulkTagUseCase,
  CreateTagUseCase,
  DeleteTagUseCase,
  MergeTagsUseCase,
  TagItemUseCase,
} from "@kairos/core/tag/usecases";
import { DrizzleTagRepository } from "../../repositories/postgres/tag.repository.ts";
import { TOKENS } from "../tokens.ts";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared/types/common";

export function configureTagContainer(container: Container) {
  // Repository
  container.registerSingleton<TagRepository>(
    TOKENS.TagRepository,
    () => new DrizzleTagRepository(),
  );

  // Service
  container.registerSingleton<TagService>(TOKENS.TagService, () => {
    const tagRepo = container.resolve<TagRepository>(TOKENS.TagRepository);
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new TagService(tagRepo, itemService);
  });

  // Use Cases
  container.registerSingleton(TOKENS.CreateTagUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new CreateTagUseCase(tagService);
  });

  container.registerSingleton(TOKENS.UpdateTagUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new CreateTagUseCase(tagService);
  });

  container.registerSingleton(TOKENS.GetTagUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new CreateTagUseCase(tagService);
  });

  container.registerSingleton(TOKENS.DeleteTagUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new DeleteTagUseCase(tagService);
  });

  container.registerSingleton(TOKENS.ListTagsUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new DeleteTagUseCase(tagService);
  });

  container.registerSingleton(TOKENS.TagItemUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new TagItemUseCase(tagService);
  });

  container.registerSingleton(TOKENS.BulkTagUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    return new BulkTagUseCase(tagService);
  });

  container.registerSingleton(TOKENS.MergeTagsUseCase, () => {
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new MergeTagsUseCase(tagService, itemService);
  });
}
