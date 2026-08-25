import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '@/api/postsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostForm, type PostFormValues } from '@/features/posts/PostForm';
import { useToast } from '@/hooks/useToast';
import type { PostStatus } from '@/types/post';

/**
 * Add New page — create a published post or a draft, then redirect.
 */
export function AddNewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(
    values: PostFormValues,
    status: Extract<PostStatus, 'published' | 'draft'>,
  ) {
    setIsSubmitting(true);
    try {
      const created = await createPost({ ...values, status });
      showToast(
        status === 'published'
          ? `“${created.title}” published.`
          : `“${created.title}” saved as draft.`,
      );
      navigate(`/posts?tab=${status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create post';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
        Add New
      </h1>

      <Card className="w-full max-w-2xl xl:max-w-3xl">
        <CardHeader>
          <CardTitle>Create post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </section>
  );
}
