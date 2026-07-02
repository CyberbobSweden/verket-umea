import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Integritetspolicy' };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="mb-8 text-4xl font-bold">Integritetspolicy</h1>
      <div className="space-y-4 text-mist">
        <p>Verket Umeå värnar om din integritet. Den här sidan beskriver vilka uppgifter vi samlar in och hur vi använder dem, i enlighet med GDPR.</p>
        <p>Vi samlar in: namn, e-post, profildata du själv fyller i, samt teknisk data som är nödvändig för att driva webbplatsen (t.ex. sessionscookies för inloggning).</p>
        <p>Vi delar aldrig dina uppgifter med tredje part i marknadsföringssyfte. Du kan när som helst begära utdrag eller radering av dina uppgifter via kontaktformuläret.</p>
      </div>
    </div>
  );
}
