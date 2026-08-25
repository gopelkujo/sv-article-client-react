/**
 * Shared post domain types used across the API layer, hooks, and UI.
 */

/** Lifecycle status of a blog post in the dashboard. */
export type PostStatus = 'published' | 'draft' | 'trashed';

/** Canonical post entity returned by the posts API. */
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

/** Payload accepted when creating or updating a post. */
export type PostInput = Partial<
  Pick<Post, 'title' | 'content' | 'category' | 'status'>
>;
