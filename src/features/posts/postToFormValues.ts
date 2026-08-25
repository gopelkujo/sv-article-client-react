import type { Post } from '@/types/post';
import type { PostFormValues } from '@/features/posts/PostForm';

/**
 * Maps a full Post entity into form initial values.
 * @param post - Source post
 * @returns Form field bag
 */
export function postToFormValues(post: Post): PostFormValues {
  return {
    title: post.title,
    content: post.content,
    category: post.category,
  };
}
