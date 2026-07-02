import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verketumea.se';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/redaktion', '/medlem', '/api', '/auth'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
