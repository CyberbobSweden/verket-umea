import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verketumea.se';

const STATIC_ROUTES = [
  '',
  '/nyheter',
  '/event',
  '/galleri',
  '/om-oss',
  '/kontakt',
  '/medlemskap',
  '/volontar',
  '/sponsorer',
  '/historia',
  '/faq',
  '/community/anslagstavla',
  '/community/omrostningar',
  '/community/forslag',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: posts }, { data: events }, { data: albums }] = await Promise.all([
    supabase.from('news_posts').select('slug, updated_at').eq('status', 'published'),
    supabase.from('events').select('slug, updated_at').eq('is_published', true),
    supabase.from('gallery_albums').select('slug, created_at').eq('is_published', true),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${siteUrl}/nyheter/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const eventEntries: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${siteUrl}/event/${e.slug}`,
    lastModified: new Date(e.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const albumEntries: MetadataRoute.Sitemap = (albums ?? []).map((a) => ({
    url: `${siteUrl}/galleri/${a.slug}`,
    lastModified: new Date(a.created_at),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...staticEntries, ...postEntries, ...eventEntries, ...albumEntries];
}
