import type { MetadataRoute } from 'next';

/**
 * Minimal PWA manifest — enables "Add to Home Screen" today. Full offline
 * support, push notifications and an install prompt are planned for
 * Phase 2 (see README roadmap) and will build on top of this file.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Verket Umeå',
    short_name: 'Verket',
    description: 'Musik, gaming och alternativ kultur i Umeå.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0B10',
    theme_color: '#0B0B10',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
