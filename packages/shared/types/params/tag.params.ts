type TagInfo = {
  name: string;
  color?: string;
};

export type FindTagByNameParams = {
  userId: string;
  tagName: string;
};

export type CreateTagParams = {
  userId: string;
  tagInfo: TagInfo;
};

export type CreateManyTagsParams = {
  userId: string;
  tagInfos: TagInfo[];
};

export type DeleteTagParams = { tagName: string; userId: string };

export type MergeTagsParams = {
  userId: string;
  sourceTagId: string;
  targetTagId: string;
};

export type TagItemParams = {
  itemId: string;
  userId: string;
  tagInfos: TagInfo[];
};

export type BulkTagParams = {
  userId: string;
  itemIds: string[];
  tagInfos: TagInfo[];
};
