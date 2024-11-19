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
import { TOKENS } from "../tokens.ts";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared/types/common";
import { DrizzleTagRepository } from "../../db/drizzle/repository/tag.repository.ts";
import type { Database } from "../../db/connection.ts";

export function configureTagBasicServices(container: Container) {
  // Repository
  container.registerSingleton<TagRepository>(TOKENS.TagRepository, () => {
    const db = container.resolve<Database>(TOKENS.DbClient);
    return new DrizzleTagRepository(db);
  });

  // Service
  container.registerSingleton<TagService>(TOKENS.TagService, () => {
    const tagRepo = container.resolve<TagRepository>(TOKENS.TagRepository);
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new TagService(tagRepo, itemService);
  });
}

export function configureTagUseCases(container: Container) {
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
