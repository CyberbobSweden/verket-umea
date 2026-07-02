import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: 'Affischmaterial', description: 'Verkets logotyper för arrangörer som gör affischer.' };

export default function PosterMaterialPage() {
  return (
    <div className="container max-w-2xl py-16">
      <p className="eyebrow mb-2">För arrangörer</p>
      <h1 className="mb-6 text-4xl font-bold sm:text-5xl">Affischmaterial</h1>
      <p className="text-mist">
        För att fånga besökares blick ser vi gärna att arrangörer använder Verkets logga på sina affischer.
        Vi har ingen fastlagd grafisk profil för storlek/placering — gör vad som känns rimligt.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <p className="mb-3 text-sm font-medium text-mist">Vit/ljus bakgrund</p>
          <div className="flex flex-wrap items-end gap-6 rounded-lg border border-white/10 bg-white p-6">
            <div className="relative h-24 w-24">
              <Image src="/logotyper/verket-logo.png" alt="Verket logga" fill className="object-contain" />
            </div>
            <div className="relative h-10 w-40">
              <Image src="/logotyper/verket-logo-wide.png" alt="Verket logga, bred" fill className="object-contain" />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-mist">Mörk bakgrund (inverterad, vit logga)</p>
          <div className="flex flex-wrap items-end gap-6 rounded-lg border border-white/10 bg-void p-6">
            <div className="relative h-24 w-24">
              <Image src="/logotyper/verket-logo-inverted.png" alt="Verket logga, vit" fill className="object-contain" />
            </div>
            <div className="relative h-10 w-40">
              <Image src="/logotyper/verket-logo-wide-inverted.png" alt="Verket logga, vit, bred" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-mist">För gråaktiga bakgrunder funkar vilken logga som helst.</p>
    </div>
  );
}
