import type {
  ArticleContent,
  BaseItem,
  EmailContent,
  PdfContent,
} from "@kairos/shared/types";

export interface Item<T = unknown> extends BaseItem {
  content: T;
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
