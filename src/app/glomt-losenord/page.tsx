import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = { title: 'Glömt lösenord' };

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <ForgotPasswordForm />
    </div>
  );
}
