import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, truncate } from '@/utils/format';
import type { Post } from '@/types/post';

interface PreviewCardProps {
  /** Published post to preview. */
  post: Post;
}

/**
 * Public-facing card for a published post on the Preview page.
 * @param props - Post entity
 */
export function PreviewCard({ post }: PreviewCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {post.category || 'Uncategorized'}
          </Badge>
          <CardDescription>
            <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
          </CardDescription>
        </div>
        <CardTitle className="text-base break-words sm:text-lg">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {truncate(post.content, 180)}
        </p>
      </CardContent>
    </Card>
  );
}
