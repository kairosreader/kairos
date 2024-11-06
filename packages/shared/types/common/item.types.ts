import { BaseEntity, UserScoped } from "@shared/types/common/entity.types.ts";
import type {
  ITEM_TYPE,
  ItemStatus,
  ItemType,
} from "@shared/constants/item.constants.ts";

export interface BaseItem extends BaseEntity, UserScoped {
  type: ItemType;
  status: ItemStatus;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  estimatedReadTime?: number;
  userId: string;
}

export interface ArticleContent {
  url: string;
  content: string;
  author?: string;
  publishedAt?: Date;
}

export interface EmailContent {
  from: string;
  to: string[];
  subject: string;
  content: string;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
}

export interface PdfContent {
  url: string;
  pageCount: number;
  metadata?: {
    author?: string;
    createdAt?: Date;
    title?: string;
  };
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
