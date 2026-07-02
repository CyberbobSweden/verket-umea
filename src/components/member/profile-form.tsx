'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { profileUpdateSchema } from '@/lib/validations';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function ProfileForm({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function uploadAvatar(file: File) {
    const path = `${profile.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) {
      toast.error('Kunde inte ladda upp bilden.');
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = profileUpdateSchema.safeParse({ display_name: displayName, username: username || null, bio: bio || null });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? 'Ogiltiga uppgifter.');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ ...parsed.data, avatar_url: avatarUrl })
      .eq('id', profile.id);
    setLoading(false);
    if (error) {
      toast.error('Kunde inte spara profilen.');
      return;
    }
    toast.success('Profil uppdaterad!');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-steel">
          {avatarUrl && <Image src={avatarUrl} alt="" fill className="object-cover" />}
        </div>
        <div>
          <Label htmlFor="avatar" className="cursor-pointer text-sm text-signal-400">
            Byt profilbild
          </Label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="display_name">Visningsnamn</Label>
        <Input id="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="username">Användarnamn</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="valfritt" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Om dig</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Sparar...' : 'Spara ändringar'}
      </Button>
    </form>
  );
}
