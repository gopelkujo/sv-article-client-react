import { useCallback, useEffect, useState } from 'react';
import { getPosts } from '@/api/postsApi';
import type { Post, PostStatus } from '@/types/post';

interface PostsState {
  posts: Post[];
  error: string | null;
  /** Status this state was loaded for; used to detect stale filters. */
  loadedFor: PostStatus | undefined | 'idle';
}

interface UsePostsResult {
  /** Loaded posts for the current filter. */
  posts: Post[];
  /** True while a fetch is in flight or the filter just changed. */
  isLoading: boolean;
  /** Error message when the last fetch failed. */
  error: string | null;
  /** Re-runs the fetch for the current status filter. */
  refresh: () => Promise<void>;
}

/**
 * Loads posts from the API layer, optionally filtered by status.
 * @param status - Optional status filter (tab selection)
 * @returns Posts list plus loading/error/refresh helpers
 */
export function usePosts(status?: PostStatus): UsePostsResult {
  const [state, setState] = useState<PostsState>({
    posts: [],
    error: null,
    loadedFor: 'idle',
  });

  const isLoading = state.loadedFor !== status;

  useEffect(() => {
    let cancelled = false;

    void getPosts(status)
      .then((data) => {
        if (cancelled) return;
        setState({ posts: data, error: null, loadedFor: status });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load posts';
        setState({ posts: [], error: message, loadedFor: status });
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loadedFor: 'idle', error: null }));
    try {
      const data = await getPosts(status);
      setState({ posts: data, error: null, loadedFor: status });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load posts';
      setState({ posts: [], error: message, loadedFor: status });
    }
  }, [status]);

  return {
    posts: isLoading ? [] : state.posts,
    isLoading,
    error: isLoading ? null : state.error,
    refresh,
  };
}
