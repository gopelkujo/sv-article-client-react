/**
 * Maps between frontend Post types and sv-article-service JSON shapes.
 */

import type { Post, PostStatus } from '@/types/post';

/** Status values accepted by the Go article service. */
export type BackendStatus = 'publish' | 'draft' | 'thrash';

/** Article JSON as returned by the service. */
export interface BackendArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  status: BackendStatus;
  created_date: string;
  updated_date: string | null;
}

/** Article write payload required by create/update endpoints. */
export interface BackendArticleWrite {
  title: string;
  content: string;
  category: string;
  status: BackendStatus;
}

const toBackendStatus: Record<PostStatus, BackendStatus> = {
  published: 'publish',
  draft: 'draft',
  trashed: 'thrash',
};

const toFrontendStatus: Record<BackendStatus, PostStatus> = {
  publish: 'published',
  draft: 'draft',
  thrash: 'trashed',
};

/**
 * Converts a frontend status to the backend enum value.
 * @param status - UI status
 * @returns Service status string
 */
export function mapStatusToBackend(status: PostStatus): BackendStatus {
  return toBackendStatus[status];
}

/**
 * Converts a backend status to the frontend enum value.
 * @param status - Service status
 * @returns UI status
 */
export function mapStatusToFrontend(status: BackendStatus): PostStatus {
  return toFrontendStatus[status];
}

/**
 * Maps a backend article into the shared frontend `Post` type.
 * @param article - Service article JSON
 * @returns Frontend post
 */
export function mapArticleToPost(article: BackendArticle): Post {
  return {
    id: String(article.id),
    title: article.title,
    content: article.content,
    category: article.category,
    status: mapStatusToFrontend(article.status),
    createdAt: article.created_date,
    updatedAt: article.updated_date ?? article.created_date,
  };
}

/**
 * Builds the full write body required by create/update endpoints.
 * @param post - Title/content/category/status fields
 * @returns Service write payload
 */
export function mapPostToWriteBody(post: {
  title: string;
  content: string;
  category: string;
  status: PostStatus;
}): BackendArticleWrite {
  return {
    title: post.title.trim(),
    content: post.content,
    category: post.category.trim(),
    status: mapStatusToBackend(post.status),
  };
}
