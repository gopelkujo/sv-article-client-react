import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { softDeletePost } from '@/api/postsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PostsEmptyState,
  PostsTable,
} from '@/features/posts/PostsTable';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/useToast';
import type { Post, PostStatus } from '@/types/post';
import { EMPTY_TAB_MESSAGES } from '@/utils/constants';

const TAB_VALUES: PostStatus[] = ['published', 'draft', 'trashed'];

/**
 * Parses a status query param into a valid PostStatus tab.
 * @param value - Raw query string value
 * @returns Valid status, defaulting to published
 */
function parseTab(value: string | null): PostStatus {
  if (value && TAB_VALUES.includes(value as PostStatus)) {
    return value as PostStatus;
  }
  return 'published';
}

/**
 * Loading placeholder for the posts table area.
 */
function PostsLoading() {
  return (
    <div className="space-y-3">
      <div className="space-y-3 md:hidden">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="hidden space-y-3 rounded-xl border bg-card p-4 md:block">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

/**
 * All Posts page with Published / Drafts / Trashed tabs and action table.
 * Tab state lives in the `?tab=` query param so redirects can land on a tab.
 */
export function AllPostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get('tab'));
  const { posts, isLoading, error, refresh } = usePosts(activeTab);
  const [trashingId, setTrashingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const tabItems = useMemo(
    () => [
      { value: 'published' as const, label: 'Published' },
      { value: 'draft' as const, label: 'Drafts' },
      { value: 'trashed' as const, label: 'Trashed' },
    ],
    [],
  );

  function handleTabChange(next: string) {
    setSearchParams({ tab: next });
  }

  function handleEdit(post: Post) {
    navigate(`/posts/${post.id}/edit`);
  }

  async function handleTrash(post: Post) {
    setTrashingId(post.id);
    try {
      await softDeletePost(post.id);
      showToast(`“${post.title}” moved to trash.`);
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not trash post';
      showToast(message, 'error');
    } finally {
      setTrashingId(null);
    }
  }

  return (
    <section className="space-y-4 sm:space-y-5">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
        All Posts
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <TabsList variant="line" className="min-w-max">
            {tabItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabItems.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-4">
            {isLoading && <PostsLoading />}

            {!isLoading && error && (
              <PostsEmptyState
                title="Could not load posts"
                description={error}
              />
            )}

            {!isLoading && !error && (
              <PostsTable
                posts={posts}
                emptyMessage={EMPTY_TAB_MESSAGES[item.value]}
                onEdit={handleEdit}
                onTrash={handleTrash}
                trashingId={trashingId}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
