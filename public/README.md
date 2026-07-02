# Statiska filer som behöver läggas till

## Ikoner & OG-bild
- `favicon.ico` — webbläsarflik-ikon
- `icon-192.png`, `icon-512.png` — PWA-ikoner (används av `src/app/manifest.ts`)
- `og-default.jpg` (1200×630) — standard Open Graph-bild (används av `src/app/layout.tsx`)

## Verkets riktiga logotyper
Den nuvarande sajten (verketumea.se/affischmaterial) publicerar föreningens officiella loggor. Ladda ner
dem själv och lägg i `public/logotyper/` med dessa filnamn (används av `/affischmaterial`-sidan):

- `verket-logo.png` — kvadratisk logga, ljus bakgrund (original: `v_700x793.png`)
- `verket-logo-wide.png` — bred logga, ljus bakgrund (original: `verket_560x150.png`)
- `verket-logo-inverted.png` — kvadratisk logga, mörk bakgrund
- `verket-logo-wide-inverted.png` — bred logga, mörk bakgrund

Källa: https://www.verketumea.se/affischmaterial/ (föreningens egna filer — hämta därifrån, inte via
hotlink till WordPress-sajten).

## Stadgar
Ladda ner föreningens riktiga stadgar och lägg som `public/dokument/stadgar.pdf`
(används av `/om-oss`-sidan). Källa: https://www.verketumea.se/wp-content/uploads/2024/02/Stadgar.pdf
