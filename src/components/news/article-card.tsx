import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Database } from '@/types/database.types';

type NewsRow = Database['public']['Tables']['news_posts']['Row'];

export function ArticleCard({ post }: { post: NewsRow }) {
  return (
    <Link href={`/nyheter/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all group-hover:border-volt/50 group-hover:shadow-[0_0_30px_rgba(0,217,255,0.12)]">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-steel">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-4xl text-white/10">VU</div>
          )}
          {post.pinned && (
            <Badge variant="volt" className="absolute left-3 top-3">
              Utvald
            </Badge>
          )}
        </div>
        <div className="p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-mist">
            {post.published_at ? formatDate(post.published_at) : 'Utkast'}
          </p>
          <h3 className="mt-2 line-clamp-2 font-display text-xl font-semibold">{post.title}</h3>
          {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-mist">{post.excerpt}</p>}
        </div>
      </Card>
    </Link>
  );
}
