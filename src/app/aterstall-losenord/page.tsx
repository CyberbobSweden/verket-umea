import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = { title: 'Återställ lösenord' };

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <ResetPasswordForm />
    </div>
  );
}
