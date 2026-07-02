import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Users,
  Images,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { getCurrentProfile } from '@/lib/authorize';

const NAV = [
  { href: '/admin', label: 'Översikt', icon: LayoutDashboard },
  { href: '/admin/nyheter', label: 'Nyheter', icon: Newspaper },
  { href: '/admin/event', label: 'Event', icon: CalendarDays },
  { href: '/admin/galleri', label: 'Galleri', icon: Images },
  { href: '/admin/anvandare', label: 'Användare', icon: Users },
  { href: '/admin/moderering', label: 'Moderering', icon: ShieldAlert },
  { href: '/admin/installningar', label: 'Inställningar', icon: Settings },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Belt-and-suspenders: middleware already blocks non-admins from /admin,
  // but Server Components should never trust routing alone.
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'admin') redirect('/');

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[220px,1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-mist hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
