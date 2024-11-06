import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import {
  ContentExtractorService,
  ExtractedContent,
} from "@core/content/mod.ts";
import { OperationError } from "@shared/types/errors/mod.ts";

export class ReadabilityExtractorService implements ContentExtractorService {
  async extractFromUrl(url: string): Promise<ExtractedContent> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new JSDOM(html, { url });
      const reader = new Readability(doc.window.document);
      const article = reader.parse();

      if (!article) {
        throw new Error("Failed to extract content");
      }

      const wordCount = article.textContent.split(/\s+/).length;
      const estimatedReadTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

      return {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        author: article.byline,
        coverImage: this.extractCoverImage(doc.window.document),
        estimatedReadTime,
      };
    } catch (error) {
      throw new OperationError("Failed to extract content", error);
    }
  }

  private extractCoverImage(document: Document): string | undefined {
    // Try to find the main image
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      "article img",
      ".post-content img",
      "article picture source",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        if (selector.includes("meta")) {
          return element.getAttribute("content") || undefined;
        } else {
          return element.getAttribute("src") || undefined;
        }
      }
    }

    return undefined;
  }
}
