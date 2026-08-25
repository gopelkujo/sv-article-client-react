/**
 * App-wide constants (pagination, categories, empty-state copy).
 */

/** Number of published posts shown per page on the public Preview page. */
export const PREVIEW_PAGE_SIZE = 5;

/**
 * Minimum field lengths enforced by sv-article-service.
 * Kept in sync with the backend validator so the UI fails fast.
 */
export const POST_FIELD_LIMITS = {
  titleMin: 20,
  contentMin: 200,
  categoryMin: 3,
} as const;

/** Human-readable empty messages keyed by post status tab. */
export const EMPTY_TAB_MESSAGES: Record<string, string> = {
  published: 'No published posts yet.',
  draft: 'No drafts yet.',
  trashed: 'Trash is empty.',
};
