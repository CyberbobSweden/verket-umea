import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Comments } from '@/components/news/comments';
import { Badge } from '@/components/ui/badge';
import { formatDate, readingTime } from '@/lib/utils';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('news_posts').select('*').eq('slug', params.slug).single();
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? post.content.slice(0, 155),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('news_posts')
    .select('*, news_categories(name, slug)')
    .eq('slug', params.slug)
    .single();

  if (!post || post.status !== 'published') notFound();

  // fire-and-forget view counter via service role (bypasses RLS write restriction cleanly)
  createAdminClient()
    .from('news_posts')
    .update({ view_count: post.view_count + 1 })
    .eq('id', post.id)
    .then(() => {});

  const { data: comments } = await supabase
    .from('comments')
    .select('id, body, created_at, author_id, profiles(display_name, avatar_url)')
    .eq('parent_type', 'news')
    .eq('parent_id', post.id)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    publisher: { '@type': 'Organization', name: 'Verket Umeå' },
  };

  return (
    <article className="container max-w-3xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-mist">
        {post.published_at && <span>{formatDate(post.published_at)}</span>}
        <span>·</span>
        <span>{readingTime(post.content)} min läsning</span>
        {post.pinned && <Badge variant="volt">Utvald</Badge>}
      </div>

      <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>

      {post.cover_image_url && (
        <div className="relative my-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10">
          <Image src={post.cover_image_url} alt="" fill priority className="object-cover" />
        </div>
      )}

      <div className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-signal-400">
        {post.content.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <a key={t} href={`/nyheter?tagg=${t}`}>
              <Badge variant="outline">#{t}</Badge>
            </a>
          ))}
        </div>
      )}

      <hr className="my-10 border-white/10" />

      <Comments
        parentType="news"
        parentId={post.id}
        initialComments={comments ?? []}
        isAuthenticated={!!user}
      />
    </article>
  );
}
