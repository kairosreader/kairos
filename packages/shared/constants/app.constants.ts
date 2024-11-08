// Application Environment
export const APP_ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type AppEnvironment = (typeof APP_ENV)[keyof typeof APP_ENV];

// API Constants
export const API = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_SORT_ORDER: "desc",
  DEFAULT_SORT_FIELD: "createdAt",
} as const;

// Content Processing
export const CONTENT = {
  MAX_TITLE_LENGTH: 255,
  MAX_EXCERPT_LENGTH: 500,
  MIN_READ_TIME: 1,
  WORDS_PER_MINUTE: 200,
  MAX_CONTENT_SIZE: 10 * 1024 * 1024, // 10MB
  PROCESSING_TIMEOUT: 30000, // 30 seconds
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PREFERENCES: "user:preferences:",
  ITEM_CONTENT: "item:content:",
  READING_PROGRESS: "reading:progress:",
} as const;

// Queue Names
export const QUEUE_NAMES = {
  ARTICLE_PROCESSING: "article.process",
  EMAIL_PROCESSING: "email.process",
  PDF_PROCESSING: "pdf.process",
  NOTIFICATION: "notification",
} as const;

// Error Codes
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  OPERATION_FAILED: "OPERATION_FAILED",
  DUPLICATE: "DUPLICATE",
  LIMIT_EXCEEDED: "LIMIT_EXCEEDED",
} as const;

// Headers
export const HEADERS = {
  AUTHORIZATION: "authorization",
  USER_ID: "x-user-id",
  CLIENT_VERSION: "x-client-version",
} as const;

// Default Preferences
export const DEFAULT_PREFERENCES = {
  theme: "system",
  fontSize: 16,
  lineSpacing: 1.5,
  syncEnabled: false,
  notificationsEnabled: false,
} as const;
