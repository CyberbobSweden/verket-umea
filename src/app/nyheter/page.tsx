import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/news/article-card';

export const metadata: Metadata = { title: 'Nyheter', description: 'Nyheter, pressmeddelanden och uppdateringar från Verket Umeå.' };
export const revalidate = 60;

export default async function NewsPage(props: { searchParams: Promise<{ kategori?: string; tagg?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  let query = supabase.from('news_posts').select('*, news_categories(name, slug)').eq('status', 'published');

  if (searchParams.tagg) query = query.contains('tags', [searchParams.tagg]);

  const { data: posts } = await query.order('pinned', { ascending: false }).order('published_at', { ascending: false });
  const { data: categories } = await supabase.from('news_categories').select('*');

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Redaktionen</p>
      <h1 className="mb-8 text-4xl font-bold sm:text-5xl">Nyheter</h1>

      <div className="mb-8 flex flex-wrap gap-2 text-sm">
        {categories?.map((c) => (
          <a key={c.id} href={`/nyheter?kategori=${c.slug}`} className="rounded-full border border-white/15 px-3 py-1 text-mist hover:border-signal-500 hover:text-white">
            {c.name}
          </a>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => <ArticleCard key={post.id} post={post} />)}
      </div>
      {(!posts || posts.length === 0) && <p className="text-mist">Inga nyheter publicerade ännu.</p>}
    </div>
  );
}
