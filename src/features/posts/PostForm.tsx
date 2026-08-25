import { useState, type FormEvent } from 'react';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { POST_FIELD_LIMITS } from '@/utils/constants';
import type { PostStatus } from '@/types/post';

export interface PostFormValues {
  title: string;
  content: string;
  category: string;
}

interface PostFormProps {
  /** Initial field values (edit mode). */
  initialValues?: Partial<PostFormValues>;
  /** Disables the whole form while a save is in flight. */
  isSubmitting?: boolean;
  /** Called when the user submits with Publish or Draft. */
  onSubmit: (
    values: PostFormValues,
    status: Extract<PostStatus, 'published' | 'draft'>,
  ) => void | Promise<void>;
}

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
}

/**
 * Validates form values against article-service field limits.
 * @param values - Current form values
 * @returns Field error map (empty when valid)
 */
function validatePostForm(values: PostFormValues): FormErrors {
  const errors: FormErrors = {};
  const title = values.title.trim();
  const content = values.content.trim();
  const category = values.category.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < POST_FIELD_LIMITS.titleMin) {
    errors.title = `Title must be at least ${POST_FIELD_LIMITS.titleMin} characters.`;
  }

  if (!content) {
    errors.content = 'Content is required.';
  } else if (content.length < POST_FIELD_LIMITS.contentMin) {
    errors.content = `Content must be at least ${POST_FIELD_LIMITS.contentMin} characters.`;
  }

  if (!category) {
    errors.category = 'Category is required.';
  } else if (category.length < POST_FIELD_LIMITS.categoryMin) {
    errors.category = `Category must be at least ${POST_FIELD_LIMITS.categoryMin} characters.`;
  }

  return errors;
}

/**
 * Shared create/edit form for title, content, and category.
 * Validates against backend field limits before invoking `onSubmit`.
 * @param props - Initial values, submit handler, and loading flag
 */
export function PostForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');

  const [errors, setErrors] = useState<FormErrors>({});
  const [pendingStatus, setPendingStatus] = useState<
    Extract<PostStatus, 'published' | 'draft'> | null
  >(null);

  const values: PostFormValues = { title, content, category };

  async function handleSubmit(
    status: Extract<PostStatus, 'published' | 'draft'>,
  ) {
    const nextErrors = validatePostForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setPendingStatus(status);
    try {
      await onSubmit(
        {
          title: title.trim(),
          content: content.trim(),
          category: category.trim(),
        },
        status,
      );
    } finally {
      setPendingStatus(null);
    }
  }

  function handleNativeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleNativeSubmit} noValidate>
      <FieldGroup>
        <FieldSet>
          <Field data-invalid={Boolean(errors.title) || undefined}>
            <FieldLabel htmlFor="post-title">Title</FieldLabel>
            <Input
              id="post-title"
              name="title"
              value={title}
              placeholder={`At least ${POST_FIELD_LIMITS.titleMin} characters`}
              aria-invalid={Boolean(errors.title)}
              disabled={isSubmitting}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errors.title) {
                  setErrors((current) => ({ ...current, title: undefined }));
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              {title.trim().length}/{POST_FIELD_LIMITS.titleMin} min
            </p>
            {errors.title && <FieldError>{errors.title}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.content) || undefined}>
            <FieldLabel htmlFor="post-content">Content</FieldLabel>
            <Textarea
              id="post-content"
              name="content"
              value={content}
              rows={10}
              placeholder={`At least ${POST_FIELD_LIMITS.contentMin} characters`}
              aria-invalid={Boolean(errors.content)}
              disabled={isSubmitting}
              onChange={(event) => {
                setContent(event.target.value);
                if (errors.content) {
                  setErrors((current) => ({ ...current, content: undefined }));
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              {content.trim().length}/{POST_FIELD_LIMITS.contentMin} min
            </p>
            {errors.content && <FieldError>{errors.content}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.category) || undefined}>
            <FieldLabel htmlFor="post-category">Category</FieldLabel>
            <Input
              id="post-category"
              name="category"
              value={category}
              placeholder={`At least ${POST_FIELD_LIMITS.categoryMin} characters`}
              aria-invalid={Boolean(errors.category)}
              disabled={isSubmitting}
              onChange={(event) => {
                setCategory(event.target.value);
                if (errors.category) {
                  setErrors((current) => ({ ...current, category: undefined }));
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              {category.trim().length}/{POST_FIELD_LIMITS.categoryMin} min
            </p>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </Field>
        </FieldSet>

        <Field className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={() => void handleSubmit('published')}
          >
            {isSubmitting && pendingStatus === 'published' ? (
              <Loader2Icon className="size-4 animate-spin" aria-hidden />
            ) : null}
            Publish
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={() => void handleSubmit('draft')}
          >
            {isSubmitting && pendingStatus === 'draft' ? (
              <Loader2Icon className="size-4 animate-spin" aria-hidden />
            ) : null}
            Draft
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
