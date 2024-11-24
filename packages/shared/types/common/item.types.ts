import type {
  ITEM_TYPE,
  ItemStatus,
  ItemType,
} from "../../constants/item.constants.ts";
import type { TagColor } from "../../constants/tag.constants.ts";
import type { BaseEntity, UserScoped } from "./entity.types.ts";

export interface ItemTag {
  id: string;
  name: string;
  color: TagColor | null;
}

export interface BaseItem extends BaseEntity, UserScoped {
  type: ItemType;
  status: ItemStatus;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: ItemTag[];
  estimatedReadTime: number | null;
  userId: string;
}

export interface ArticleContent {
  url: string;
  content: string;
  author: string | null;
  publishedAt: Date | null;
}

export interface EmailContent {
  from: string;
  to: string[];
  subject: string;
  content: string;
  attachments:
    | Array<{
      name: string;
      url: string;
    }>
    | null;
}

export interface PdfContent {
  url: string;
  pageCount: number;
  metadata: {
    author: string | null;
    createdAt: Date | null;
    title: string | null;
  } | null;
}

export type ItemContent = ArticleContent | EmailContent | PdfContent;

export type ContentTypeMap = {
  [ITEM_TYPE.ARTICLE]: ArticleContent;
  [ITEM_TYPE.EMAIL]: EmailContent;
  [ITEM_TYPE.PDF]: PdfContent;
};

export function isArticleContent(content: unknown): content is ArticleContent {
  return (content as ArticleContent)?.url !== undefined;
}

export function isEmailContent(content: unknown): content is EmailContent {
  return (content as EmailContent)?.from !== undefined;
}

export function isPdfContent(content: unknown): content is PdfContent {
  return (content as PdfContent)?.pageCount !== undefined;
}

export interface ItemInfo {
  itemId: string;
  itemType: ItemType;
}
