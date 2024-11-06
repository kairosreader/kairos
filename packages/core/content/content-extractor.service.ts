export interface ExtractedContent {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedAt?: Date;
  coverImage?: string;
  estimatedReadTime?: number;
}

export interface ContentExtractorService {
  extractFromUrl(url: string): Promise<ExtractedContent>;
}
