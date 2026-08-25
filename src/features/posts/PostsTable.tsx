import { FileTextIcon, Loader2Icon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Post } from '@/types/post';

interface PostsTableProps {
  /** Posts to render in the table. */
  posts: Post[];
  /** Empty-state message for the active tab. */
  emptyMessage: string;
  /** Navigates to the edit page for a post. */
  onEdit: (post: Post) => void;
  /** Soft-deletes a post (moves to trashed). */
  onTrash: (post: Post) => void;
  /** Id currently being trashed (disables that row's trash button). */
  trashingId?: string | null;
}

interface PostActionsProps {
  post: Post;
  trashingId: string | null;
  onEdit: (post: Post) => void;
  onTrash: (post: Post) => void;
}

/**
 * Edit / trash actions shared by table and mobile card layouts.
 * @param props - Post and action handlers
 */
function PostActions({ post, trashingId, onEdit, onTrash }: PostActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Edit ${post.title}`}
        onClick={() => onEdit(post)}
      >
        <PencilIcon className="size-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Move ${post.title} to trash`}
        disabled={trashingId === post.id || post.status === 'trashed'}
        onClick={() => onTrash(post)}
      >
        {trashingId === post.id ? (
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
        ) : (
          <Trash2Icon className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
}

/**
 * Posts list with a mobile card layout and a desktop/tablet table.
 * @param props - Rows plus edit/trash handlers
 */
export function PostsTable({
  posts,
  emptyMessage,
  onEdit,
  onTrash,
  trashingId = null,
}: PostsTableProps) {
  if (posts.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>{emptyMessage}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-xl border bg-card p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-medium leading-snug">{post.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {post.content || 'No content'}
                </p>
                <Badge variant="secondary">
                  {post.category || 'Uncategorized'}
                </Badge>
              </div>
              <PostActions
                post={post}
                trashingId={trashingId}
                onEdit={onEdit}
                onTrash={onTrash}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px] lg:min-w-[240px]">
                Title
              </TableHead>
              <TableHead className="w-32 lg:w-40">Category</TableHead>
              <TableHead className="w-24 lg:w-28">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-0 whitespace-normal">
                  <div className="space-y-0.5">
                    <p className="truncate font-medium lg:whitespace-normal lg:break-words">
                      {post.title}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {post.content || 'No content'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="max-w-full truncate">
                    {post.category || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PostActions
                    post={post}
                    trashingId={trashingId}
                    onEdit={onEdit}
                    onTrash={onTrash}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/**
 * Compact empty state used by pages when a list fails to load.
 * @param props - Title and optional description
 */
export function PostsEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Empty className="border border-dashed px-4 py-10 sm:px-6 sm:py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription className="break-words">
            {description}
          </EmptyDescription>
        ) : null}
      </EmptyHeader>
    </Empty>
  );
}
