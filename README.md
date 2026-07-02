# Verket Umeå

En modern, community-driven webbplats för den ideella föreningen **Verket Umeå** — musik, gaming och
alternativ kultur. Byggd för att ersätta verketumea.se med ett riktigt medlemssystem, event- och
nyhetshantering, community-funktioner och en adminpanel som styrelsen faktiskt kan använda.

**Tech stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui ·
Framer Motion · Supabase (Auth + Postgres + Storage) · GitHub Actions · Vercel

---

## Innehåll

- [Funktioner](#funktioner)
- [Kom igång lokalt](#kom-igång-lokalt)
- [Miljövariabler](#miljövariabler)
- [Databas & Supabase](#databas--supabase)
- [Admin & roller](#admin--roller)
- [Deployment](#deployment)
- [Projektstruktur](#projektstruktur)
- [Säkerhet](#säkerhet)
- [Roadmap (Fas 2)](#roadmap-fas-2)

---

## Funktioner

**Publikt**
Hem, Nyheter, Event, Galleri, Om oss, Kontakt, Medlemskap, Volontär, Sponsorer, Historia, FAQ, global sök.

**Event**
Kalender (månad/vecka/agenda), kategorifilter, RSVP med platsgräns och väntelista, nedräkning, karta,
dela event, export till iCal (per event + hela kalendern), import från Google Calendar (redaktörer).

**Nyheter**
Artiklar med kategorier/taggar, utkast/publicerat, pinnade artiklar, kommentarer, fritextsökning på svenska.

**Galleri**
Album, lightbox med tangentbordsnavigering, bild- och videostöd, lazy loading, bilduppladdning i adminpanelen.

**Konton & roller**
Supabase Auth (e-post, Google, Discord), glömt lösenord, profilsida med avatar. Fem roller: besökare,
medlem, volontär, redaktör, administratör — styrda av databasens Row Level Security, inte bara UI:t.

**Medlem**
Profil, digitalt medlemskort, sparade/kommande event, eventhistorik, notissida.

**Adminpanel**
Dashboard med statistik, hantera nyheter/event/galleri/användare, ändra roller, moderera kommentarer och
kontaktmeddelanden, sajtinställningar (öppettider, kontakt-e-post, admin-bootstrap-e-post).

**Community**
Anslagstavla med trådar och kommentarer, omröstningar, förslagslåda, volontärpoäng (gamification).

**SEO & prestanda**
Dynamisk sitemap.xml och robots.txt, Open Graph/Twitter Cards, Schema.org (Event, NewsArticle), optimerade
bilder via `next/image`, WCAG AA-fokus (synligt tangentbordsfokus, `prefers-reduced-motion`).

**Säkerhet**
RLS på varje tabell, service-role-klienten är serverside-only, honeypot-fält mot spam, in-memory rate
limiting på känsliga endpoints, CSP-headers, DOMPurify-sanering av kommentarer, SSRF-skydd på
Google Calendar-import (endast `calendar.google.com` tillåts).

---

## Innehåll hämtat från nuvarande sajten

Adress (Götgatan 2, 903 27 Umeå), kontakt-e-post (verketforening@gmail.com), medlemsavgift (50 kr via
Swish 123-166 59 42 eller Nordea plusgiro 920287-0) och länken till föreningens stadgar är hämtade direkt
från nuvarande verketumea.se och stämmer mot den sajten. Öppettider, sociala medier-länkar, historik och
statistik (medlemsantal, antal event/år) fanns **inte** på nuvarande sajt och är lämnade som tydligt
uppmärkta platshållare i `supabase/seed.sql` och på `/historia` — fyll i dem med riktiga siffror från
styrelsen innan lansering.

## Kom igång lokalt

**Krav:** Node.js ≥ 18.18, npm, [Supabase CLI](https://supabase.com/docs/guides/cli) (för lokal databas), Docker (körs av Supabase CLI).

```bash
git clone https://github.com/<ditt-användarnamn>/verket-umea.git
cd verket-umea
npm install

cp .env.example .env.local
# fyll i NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY

# starta lokal Supabase-stack (Postgres, Auth, Storage) i Docker
supabase start

# kör migrationer + seed mot den lokala databasen
supabase db reset

npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

Skapa ett konto via `/registrera` med **samma e-post som `ADMIN_BOOTSTRAP_EMAIL`** i din `.env.local` —
det kontot blir automatiskt administratör vid första inloggningen (se `supabase/seed.sql` och
`supabase/migrations/0002_functions_triggers.sql`).

---

## Miljövariabler

Se [`.env.example`](./.env.example) för samtliga variabler och kommentarer. De viktigaste:

| Variabel | Beskrivning |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publika Supabase-nycklar, säkra att exponera i klienten (skyddas av RLS). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Hemlig.** Server-only, kringgår RLS. Används bara i `src/lib/supabase/admin.ts`. |
| `ADMIN_BOOTSTRAP_EMAIL` | E-posten som blir admin automatiskt vid första inloggning. |
| `NEXT_PUBLIC_SITE_URL` | Bas-URL för sitemap, OG-taggar och Schema.org. |

---

## Databas & Supabase

Schemat ligger i `supabase/migrations/`, körs i ordning:

1. `0001_init.sql` — tabeller, enums, index
2. `0002_functions_triggers.sql` — hjälpfunktioner, admin-bootstrap-trigger, väntelistelogik, volontärpoäng
3. `0003_rls_policies.sql` — Row Level Security för varje tabell
4. `0004_storage_buckets.sql` — Storage-buckets (avatars, galleri, nyhetsbilder, dokument) + policies

`supabase/seed.sql` fyller i grundinställningar, nyhetskategorier och forum-kategorier — idempotent, kan
köras om.

**Regenerera TypeScript-typer** efter schemaändringar:

```bash
npm run db:types
```

---

## Admin & roller

Roller (lägst → högst behörighet): `visitor → member → volunteer → editor → admin`.

- **Första admin:** kontot med e-posten i `ADMIN_BOOTSTRAP_EMAIL` blir admin automatiskt vid första
  inloggningen — ingen manuell SQL behövs.
- **Fler admins:** logga in som admin → **Adminpanel → Användare** → välj roll i dropdownen. Alla
  rolländringar loggas i `audit_log`.
- **Skydd:** Row Level Security tillåter bara admins att skriva till `profiles.role`. API-routen
  `PATCH /api/admin/users/[id]/role` dubbelkollar detta server-side innan den använder service-role-klienten.

---

## Deployment

**Vercel**

1. Importera repot på [vercel.com/new](https://vercel.com/new).
2. Lägg till miljövariablerna från `.env.example` i Project Settings → Environment Variables.
3. Deploy — Vercel bygger automatiskt med `next build`.

**GitHub Actions** (`.github/workflows/`)

- `ci.yml` — lint, typecheck och build på varje PR mot `main`.
- `supabase-migrations.yml` — kör `supabase db push` mot produktionsdatabasen när något i
  `supabase/migrations/` ändras på `main`.
- `deploy.yml` — deployar till Vercel produktion efter push till `main`.

Secrets som behöver sättas i GitHub → Settings → Secrets and variables → Actions:
`VERCEL_TOKEN`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

---

## Projektstruktur

```
src/
  app/                  # Next.js App Router — sidor, layouts, API-routes
    admin/              # Adminpanel (skyddad av middleware + requireRole)
    api/                # Route handlers (RSVP, iCal, sök, kontakt, ...)
    event/ nyheter/ galleri/ community/ medlem/ ...
  components/
    ui/                 # shadcn/ui-primitiver (button, card, dialog, ...)
    layout/ home/ events/ news/ gallery/ auth/ member/ admin/ community/ shared/
  lib/
    supabase/           # client.ts (browser), server.ts (SSR), admin.ts (service role)
    authorize.ts        # requireRole() — server-side rollkontroll
    validations.ts       # Zod-scheman
    ical.ts utils.ts
  middleware.ts          # auth-refresh, route-skydd, rate limiting
  types/database.types.ts
supabase/
  migrations/            # SQL, körs i ordning
  seed.sql
  config.toml
.github/workflows/        # CI, Supabase-migrationer, Vercel-deploy
```

---

## Säkerhet

> **Version note (uppdaterad):** Projektet är nu på **Next.js 15.5.18** och **React 19**, inte 14 som i den
> första versionen. Next 14 blev EOL 2025-10-26 och fick från maj 2026 flera allvarliga sårbarheter
> (bl.a. SSRF via WebSocket-uppgraderingar, middleware/auth-bypass, cache poisoning) som **aldrig patchades
> för 14.x** — en uppgradering var obligatorisk, inte valfri. Migreringen är genomförd och verifierad:
> `npx tsc --noEmit`, `npx eslint src` och `next build` (webpack-kompileringen) går alla igenom rent.
>
> Två saker värda att känna till efter migreringen:
> - `cookies()`, route-`params` och `searchParams` är nu asynkrona i hela kodbasen (Next 15-kravet).
> - `src/middleware.ts` använder nu `supabase.auth.getClaims()` istället för `getUser()` — verifierar JWT:n
>   lokalt (snabbare, ingen nätverksrunda), vilket är Supabase's nuvarande rekommendation för sidskydd.
>   Adminpanelen har ändå ett eget serverside-rollcheck i `src/app/admin/layout.tsx` utöver middleware,
>   eftersom Next.js middleware haft flera kringgåendebuggar (senast maj 2026) — lita aldrig på middleware
>   som enda skyddslager.
>
> `npm audit` visar 2 kvarvarande moderata varningar, båda i PostCSS som är **paketerat inuti Next.js
> självt** (inte vår kod) — väntar på en uppströms Next-patch, inget vi kan åtgärda från vår sida.

- **Row Level Security** på varje tabell — även om ett API-anrop manipuleras stoppar databasen otillåtna
  läsningar/skrivningar.
- **Service-role-klienten** (`src/lib/supabase/admin.ts`) importerar `server-only`, vilket gör det till ett
  build-fel att råka importera den i en klientkomponent.
- **Rate limiting** i `middleware.ts` på `/api/contact`, `/api/auth`, `/api/comments`.
- **CSRF/XSS:** Server Actions + Route Handlers valideras med Zod; kommentarer saneras med DOMPurify;
  strikt Content-Security-Policy sätts i `next.config.mjs`.
- **SSRF-skydd:** Google Calendar-import accepterar enbart URL:er från `calendar.google.com`.
- **Lösenord:** hanteras helt av Supabase Auth — hashas med bcrypt server-side, syns aldrig i klartext i
  vår kod eller databas.

---

## Roadmap (Fas 2)

Kärnan ovan är byggd och produktionsredo. Följande är medvetet uppskjutet till nästa fas:

- 🎫 QR-biljetter till events + incheckning
- 📱 Fullt PWA-stöd (offline, installationsprompt) — grundmanifest finns redan i `src/app/manifest.ts`
- 🔔 Push-notiser
- 💬 Discord-bot-integration
- 📺 Twitch/YouTube-embed på eventsidor
- 🎵 Spotify-spellistor
- 📸 Instagram-flöde på startsidan
- 🤖 AI-assistent för besökare
- 📂 Fullt dokumentarkiv (grundtabell `documents` finns redan)
- 📍 Interaktiv karta över hela huset (utöver dagens Google Maps-embed)

---

## Licens

MIT — se [LICENSE](./LICENSE).
