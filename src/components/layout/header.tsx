'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/layout/user-menu';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database.types';

const NAV = [
  { href: '/nyheter', label: 'Nyheter' },
  { href: '/event', label: 'Event' },
  { href: '/galleri', label: 'Galleri' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/medlemskap', label: 'Medlemskap' },
  { href: '/volontar', label: 'Volontär' },
  { href: '/affischmaterial', label: 'Affischmaterial' },
  { href: '/community/anslagstavla', label: 'Community' },
  { href: '/kontakt', label: 'Kontakt' },
];

type Profile = Database['public']['Tables']['profiles']['Row'] | null;

export function Header({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-widest">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-signal-500 to-volt text-void">
            V
          </span>
          <span className="text-gradient">VERKET</span>
          <span className="text-mist">UMEÅ</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium text-mist transition-colors hover:bg-white/5 hover:text-white',
                pathname?.startsWith(item.href) && 'bg-white/5 text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Sök">
            <Link href="/sok">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          {profile && (
            <Button variant="ghost" size="icon" asChild aria-label="Notiser">
              <Link href="/medlem/notiser">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <UserMenu profile={profile} />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Meny">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-void px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-mist hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
