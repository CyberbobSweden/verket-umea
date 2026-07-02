import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NewsForm } from '@/components/admin/news-form';

export const metadata: Metadata = { title: 'Redigera artikel · Admin' };

export default async function EditNewsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('news_posts').select('*').eq('id', params.id).single();
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Redigera artikel</h1>
      <NewsForm post={post} />
    </div>
  );
}
