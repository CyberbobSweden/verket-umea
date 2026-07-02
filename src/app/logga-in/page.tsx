import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Logga in' };

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
