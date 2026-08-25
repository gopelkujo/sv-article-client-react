import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updatePost } from '@/api/postsApi';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PostForm,
  type PostFormValues,
} from '@/features/posts/PostForm';
import { PostsEmptyState } from '@/features/posts/PostsTable';
import { postToFormValues } from '@/features/posts/postToFormValues';
import { usePost } from '@/hooks/usePost';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import type { PostStatus } from '@/types/post';

/**
 * Edit Post page — update title/content/category and set Publish or Draft.
 */
export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { post, isLoading, error } = usePost(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(
    values: PostFormValues,
    status: Extract<PostStatus, 'published' | 'draft'>,
  ) {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updated = await updatePost(id, { ...values, status });
      showToast(
        status === 'published'
          ? `“${updated.title}” published.`
          : `“${updated.title}” saved as draft.`,
      );
      navigate(`/posts?tab=${status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update post';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div>
        <Link
          to="/posts"
          className={cn(
            buttonVariants({ variant: 'link' }),
            'h-auto px-0 text-muted-foreground',
          )}
        >
          ← All Posts
        </Link>
        <h1 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Edit Post
        </h1>
      </div>

      {isLoading && (
        <Card className="w-full max-w-2xl xl:max-w-3xl">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-9 w-48" />
          </CardContent>
        </Card>
      )}

      {!isLoading && (error || !post) && (
        <PostsEmptyState
          title="Post not found"
          description={error ?? 'This post may have been removed.'}
        />
      )}

      {!isLoading && post && (
        <Card className="w-full max-w-2xl xl:max-w-3xl">
          <CardHeader>
            <CardTitle className="break-words">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              key={post.id}
              initialValues={postToFormValues(post)}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}
    </section>
  );
}
