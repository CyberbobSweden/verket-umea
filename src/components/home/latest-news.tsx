import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/shared/section-heading';
import { ArticleCard } from '@/components/news/article-card';

export async function LatestNews() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .order('pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Redaktionen" title="Senaste nytt" href="/nyheter" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
