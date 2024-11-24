import type {
  ArticleContent,
  BaseItem,
  EmailContent,
  PdfContent,
} from "@kairos/shared/types";
import type { ItemStatus, ItemType } from "@kairos/shared/constants";

export interface ItemProgress {
  progress: number;
  lastPosition: number;
}

export interface Item<T = unknown> extends BaseItem {
  type: ItemType;
  status: ItemStatus;
  userId: string;
  content: T;
  progress: ItemProgress | null;
}

export type Article = Item<ArticleContent>;
export type Email = Item<EmailContent>;
export type Pdf = Item<PdfContent>;

export type AnyItem = Article | Email | Pdf;

export interface ReadingProgress {
  itemId: string;
  userId: string;
  progress: number; // 0-100
  lastPosition: number;
  lastReadAt: Date;
}

export const ITEM_FILTERABLE_FIELDS = [
  "title",
  "tags",
  "type",
  "status",
  "createdAt",
  "updatedAt",
] as const;

export const ITEM_SORTABLE_FIELDS = [
  "title",
  "createdAt",
  "updatedAt",
] as const;

export type ItemFilterableFields = (typeof ITEM_FILTERABLE_FIELDS)[number];
export type ItemSortableFields = (typeof ITEM_SORTABLE_FIELDS)[number];
