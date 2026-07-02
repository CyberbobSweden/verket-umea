import type { Metadata } from 'next';
import { NewsForm } from '@/components/admin/news-form';

export const metadata: Metadata = { title: 'Ny artikel · Admin' };

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Ny artikel</h1>
      <NewsForm />
    </div>
  );
}
