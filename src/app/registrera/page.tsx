import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = { title: 'Skapa konto' };

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <RegisterForm />
    </div>
  );
}
