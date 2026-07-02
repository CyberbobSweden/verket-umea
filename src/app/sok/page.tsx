import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchClient } from '@/components/shared/search-client';

export const metadata: Metadata = { title: 'Sök' };

export default function SearchPage() {
  return (
    <div className="container max-w-2xl py-16">
      <p className="eyebrow mb-2">Sök</p>
      <h1 className="mb-8 text-4xl font-bold">Sök på Verket Umeå</h1>
      <Suspense>
        <SearchClient />
      </Suspense>
    </div>
  );
}
