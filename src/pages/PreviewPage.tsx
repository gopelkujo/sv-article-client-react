import { PostsEmptyState } from '@/features/posts/PostsTable';
import { PreviewCard } from '@/features/posts/PreviewCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { usePagination } from '@/hooks/usePagination';
import { usePosts } from '@/hooks/usePosts';
import { PREVIEW_PAGE_SIZE } from '@/utils/constants';

/**
 * Public-style Preview page listing published posts with pagination.
 */
export function PreviewPage() {
  const { posts, isLoading, error } = usePosts('published');
  const { page, totalPages, pageItems, setPage } = usePagination(
    posts,
    PREVIEW_PAGE_SIZE,
  );

  return (
    <section className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Preview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Published posts only
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="hidden h-40 w-full rounded-xl xl:block" />
        </div>
      )}

      {!isLoading && error && (
        <PostsEmptyState title="Could not load preview" description={error} />
      )}

      {!isLoading && !error && posts.length === 0 && (
        <PostsEmptyState title="No published posts yet." />
      )}

      {!isLoading && !error && posts.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((post) => (
              <PreviewCard key={post.id} post={post} />
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text="Prev"
                    aria-disabled={page <= 1}
                    className={
                      page <= 1 ? 'pointer-events-none opacity-50' : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={page >= totalPages}
                    className={
                      page >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </section>
  );
}
