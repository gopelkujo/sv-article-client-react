/**
 * =============================================================================
 * postsApi — API abstraction layer for the posts domain
 * =============================================================================
 *
 * UI code must call these exports only. Transport details (URL, envelope,
 * field renaming, status mapping) stay in this module and its helpers.
 *
 * CURRENT BEHAVIOR
 * ----------------
 * Talks to `sv-article-service` via `fetch`:
 *   - Base URL: `import.meta.env.VITE_API_BASE_URL` or `/api` (Vite proxy)
 *   - List: GET /article/{limit}/{offset} then optional client-side status filter
 *   - Soft delete: PUT full article with status `thrash` (service has no soft-delete)
 *
 * Backend quirks handled here:
 *   - Envelope `{ success, data, error }`
 *   - `id` number ↔ string
 *   - `created_date` / `updated_date` ↔ `createdAt` / `updatedAt`
 *   - `publish`/`thrash` ↔ `published`/`trashed`
 *   - Create/update require a full body (no partial PATCH semantics)
 * =============================================================================
 */

import { apiRequest } from '@/api/http';
import {
  mapArticleToPost,
  mapPostToWriteBody,
  type BackendArticle,
} from '@/api/mappers';
import type { Post, PostInput, PostStatus } from '@/types/post';

/** Max articles fetched for list views (service has no status query filter). */
const LIST_LIMIT = 100;

/**
 * Lists posts, optionally filtered by status (client-side after fetch).
 * @param status - When provided, only posts with this status are returned
 * @returns Promise resolving to a post array (newest first, matching API order)
 */
export async function getPosts(status?: PostStatus): Promise<Post[]> {
  const articles = await apiRequest<BackendArticle[]>(
    `/article/${LIST_LIMIT}/0`,
  );
  const posts = articles.map(mapArticleToPost);
  if (!status) return posts;
  return posts.filter((post) => post.status === status);
}

/**
 * Fetches a single post by id.
 * @param id - Post id (stringified numeric id from the service)
 * @returns Promise resolving to the post
 */
export async function getPostById(id: string): Promise<Post> {
  const article = await apiRequest<BackendArticle>(`/article/${id}`);
  return mapArticleToPost(article);
}

/**
 * Creates a new post. Requires title, content, category, and status.
 * @param data - Partial post fields (status defaults to draft)
 * @returns Promise resolving to the created post
 */
export async function createPost(data: PostInput): Promise<Post> {
  const body = mapPostToWriteBody({
    title: data.title ?? '',
    content: data.content ?? '',
    category: data.category ?? '',
    status: data.status ?? 'draft',
  });

  const article = await apiRequest<BackendArticle>('/article/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return mapArticleToPost(article);
}

/**
 * Updates an existing post. Merges with the current article then PUTs a full body
 * (the service rejects partial updates).
 * @param id - Post id
 * @param data - Partial fields to merge
 * @returns Promise resolving to the updated post
 */
export async function updatePost(id: string, data: PostInput): Promise<Post> {
  const current = await getPostById(id);
  const body = mapPostToWriteBody({
    title: data.title !== undefined ? data.title : current.title,
    content: data.content !== undefined ? data.content : current.content,
    category: data.category !== undefined ? data.category : current.category,
    status: data.status !== undefined ? data.status : current.status,
  });

  const article = await apiRequest<BackendArticle>(`/article/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return mapArticleToPost(article);
}

/**
 * Soft-deletes a post by setting status to trashed (`thrash` on the service).
 * @param id - Post id
 * @returns Promise that resolves when the update completes
 */
export async function softDeletePost(id: string): Promise<void> {
  await updatePost(id, { status: 'trashed' });
}
