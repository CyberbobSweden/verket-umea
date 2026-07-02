'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/database.types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'visitor', label: 'Besökare' },
  { value: 'member', label: 'Medlem' },
  { value: 'volunteer', label: 'Volontär' },
  { value: 'editor', label: 'Redaktör' },
  { value: 'admin', label: 'Administratör' },
];

export function RoleSelect({ userId, currentRole, currentUserId }: { userId: string; currentRole: UserRole; currentUserId: string }) {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isSelf = userId === currentUserId;

  async function updateRole(next: UserRole) {
    if (isSelf) {
      toast.error('Du kan inte ändra din egen roll här — be en annan admin göra det.');
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: next }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error('Kunde inte uppdatera rollen.');
      return;
    }
    setRole(next);
    toast.success(`Roll uppdaterad till ${ROLES.find((r) => r.value === next)?.label}.`);
    router.refresh();
  }

  return (
    <Select.Root value={role} onValueChange={(v) => updateRole(v as UserRole)} disabled={loading || isSelf}>
      <Select.Trigger
        className={cn(
          'flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm disabled:opacity-50',
        )}
        aria-label="Ändra roll"
      >
        <Select.Value />
        <ChevronDown className="h-3.5 w-3.5" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 overflow-hidden rounded-md border border-white/10 bg-graphite shadow-2xl">
          <Select.Viewport className="p-1">
            {ROLES.map((r) => (
              <Select.Item
                key={r.value}
                value={r.value}
                className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm outline-none hover:bg-white/5 data-[state=checked]:text-signal-400"
              >
                <Select.ItemText>{r.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="h-3.5 w-3.5" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
