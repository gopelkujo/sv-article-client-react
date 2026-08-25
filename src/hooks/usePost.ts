import { useCallback, useEffect, useState } from 'react';
import { getPostById } from '@/api/postsApi';
import type { Post } from '@/types/post';

interface PostState {
  post: Post | null;
  error: string | null;
  loadedFor: string | undefined | 'idle';
}

interface UsePostResult {
  /** Loaded post, or null when missing / not yet loaded. */
  post: Post | null;
  /** True while a fetch is in flight or the id just changed. */
  isLoading: boolean;
  /** Error message when the fetch failed. */
  error: string | null;
  /** Re-fetches the post by id. */
  refresh: () => Promise<void>;
}

/**
 * Loads a single post by id from the API layer.
 * @param id - Post id, or undefined while waiting for route params
 * @returns Post entity plus loading/error/refresh helpers
 */
export function usePost(id: string | undefined): UsePostResult {
  const [state, setState] = useState<PostState>({
    post: null,
    error: null,
    loadedFor: 'idle',
  });

  const isLoading = Boolean(id) && state.loadedFor !== id;

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    void getPostById(id)
      .then((data) => {
        if (cancelled) return;
        setState({ post: data, error: null, loadedFor: id });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load post';
        setState({ post: null, error: message, loadedFor: id });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const refresh = useCallback(async () => {
    if (!id) return;
    setState((current) => ({ ...current, loadedFor: 'idle', error: null }));
    try {
      const data = await getPostById(id);
      setState({ post: data, error: null, loadedFor: id });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load post';
      setState({ post: null, error: message, loadedFor: id });
    }
  }, [id]);

  if (!id) {
    return { post: null, isLoading: false, error: null, refresh };
  }

  return {
    post: isLoading ? null : state.post,
    isLoading,
    error: isLoading ? null : state.error,
    refresh,
  };
}
