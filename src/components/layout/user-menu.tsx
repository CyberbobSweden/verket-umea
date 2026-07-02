'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, User, ShieldCheck, LayoutDashboard, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'] | null;

export function UserMenu({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createClient();

  if (!profile) {
    return (
      <Button asChild size="sm">
        <Link href="/logga-in">Logga in</Link>
      </Button>
    );
  }

  const isStaff = profile.role === 'editor' || profile.role === 'admin';

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-mist" />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-md border border-white/10 bg-graphite p-1 shadow-2xl"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium">{profile.display_name}</p>
            <p className="truncate text-xs text-mist">{profile.membership_number ?? 'Ingen medlem ännu'}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
          <DropdownMenu.Item asChild>
            <Link href="/medlem/profil" className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/5">
              <User className="h-4 w-4" /> Min profil
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/medlem/kort" className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/5">
              <IdCard className="h-4 w-4" /> Medlemskort
            </Link>
          </DropdownMenu.Item>
          {isStaff && (
            <DropdownMenu.Item asChild>
              <Link href="/redaktion" className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/5">
                <ShieldCheck className="h-4 w-4" /> Redaktion
              </Link>
            </DropdownMenu.Item>
          )}
          {profile.role === 'admin' && (
            <DropdownMenu.Item asChild>
              <Link href="/admin" className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm hover:bg-white/5">
                <LayoutDashboard className="h-4 w-4" /> Adminpanel
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
          <DropdownMenu.Item
            onSelect={signOut}
            className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Logga ut
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
