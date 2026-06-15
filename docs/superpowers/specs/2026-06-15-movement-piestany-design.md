# Design Spec: Movement Piešťany Website

**Date:** 2026-06-15
**Status:** Approved

---

## 1. Project Summary

A single-page landing website in Slovak for Movement Piešťany — a movement training school in Piešťany, Slovakia run by Radovan Komár. The site presents the training philosophy, pillars, schedule, pricing, and trainer, and drives visitors to join the WhatsApp community group.

**Non-goals:** No booking backend, no user accounts, no online payments.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | AstroJS (minimal starter — `npm create astro@latest`) |
| Styling | TailwindCSS |
| Fonts | Outfit (headings, 800–900 weight) + Inter (body) via Google Fonts |
| Build | Static SSG — fully pre-rendered, zero server runtime |
| Hosting | Vercel, Netlify, or GitHub Pages (free tier) |
| Language | Slovak throughout |

---

## 3. Design System

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `bg-base` | `#080808` | Page background |
| `bg-card` | `#121212` | Card / section backgrounds |
| `bg-deep` | `#0a0a0a` | Alternating section backgrounds |
| `bg-footer` | `#050505` | Footer background |
| `accent-lime` | `#EDFE03` | Primary accent, CTAs, highlights |
| `accent-cyan` | `#00D8FF` | Secondary accent |
| `text-primary` | `#FFFFFF` | Headlines |
| `text-body` | `#999999` | Body / description text (**minimum** on `#080808`) |
| `text-secondary` | `#888888` | Secondary / caption text |
| `text-label` | `#AAAAAA` | Section labels |
| `text-muted` | `#777777` | De-emphasised text (e.g. strikethrough) |
| `border-card` | `#1E1E1E` | Card borders |
| `border-subtle` | `#1A1A1A` | Section dividers |

**Contrast rule:** Never use text darker than `#777` on `#080808` background.

### Typography

- **Section labels:** 9px, weight 700, `letter-spacing: 3px`, colour `#AAAAAA`, ALL CAPS
- **Card labels:** 8–9px, weight 700, `letter-spacing: 2px`, accent colour, ALL CAPS
- **Headlines:** Outfit, 800–900 weight, tight `letter-spacing: -0.5px` to `-1px`
- **Body:** Inter, 11–12px, `line-height: 1.6–1.7`, colour `#999`

### Tailwind Colour Configuration

All colour tokens are registered in `tailwind.config.mjs` under `theme.extend.colors` so that every colour is a single-point-of-change and the implementation uses semantic class names throughout (e.g. `text-body`, `bg-card`, `text-accent-lime`). Never use raw hex values in component markup.

```js
// tailwind.config.mjs (excerpt)
colors: {
  'bg-base':    '#080808',
  'bg-card':    '#121212',
  'bg-deep':    '#0a0a0a',
  'bg-footer':  '#050505',
  'accent-lime':'#EDFE03',
  'accent-cyan':'#00D8FF',
  'text-primary':'#ffffff',
  'text-body':  '#999999',
  'text-secondary':'#888888',
  'text-label': '#aaaaaa',
  'text-muted': '#777777',
  'border-card':'#1e1e1e',
  'border-subtle':'#1a1a1a',
}
```

Usage: `text-body`, `bg-card`, `border-border-card`, `text-accent-lime`, etc.

### Interactive Elements

- **Primary CTA:** `background: linear-gradient(90deg, #EDFE03, #00D8FF)`, `color: #080808`, `font-weight: 700`
- **Secondary CTA:** `border: 1px solid #555`, `color: #CCC`
- **Lime CTA button:** `background: #EDFE03`, `color: #080808`, `font-weight: 700`
- **Card hover:** `box-shadow: 0 0 15px rgba(237,254,3,0.15)` on lime-accented cards
- **Bento card borders (left accent):** `border-left: 3px solid <accent-colour>`

### Bento Grid Usage

Bento (asymmetric) grids are used in exactly two sections where content has natural size hierarchy:
1. **O pohybe** — 1 wide principle card (VNÍMANIE) + 2 small cards (ZRUČNOSŤ, SYNERGIA)
2. **Ako to vyzerá** — 1 large photo (2× height, group class) + 2 smaller photos (skill, outdoor)

All other multi-card sections use uniform equal grids.

---

## 4. Page Structure

Single-page layout with 9 sections. Navigation links use anchor IDs.

### Section 1 — Sticky Nav

- **Left:** "MOVEMENT PIEŠŤANY" in `accent-lime`, weight 800, `letter-spacing: 2px`
- **Right:** anchor links (Piliere, Rozvrh, Ceny, Tréner, Kontakt) in `#888` at 9px + WhatsApp CTA button (`bg: #EDFE03`, `color: #080808`)
- Sticky at top, `background: #0D0D0D`, `border-bottom: 1px solid #1A1A1A`
- Mobile: hamburger menu collapsing nav links; WhatsApp button always visible

### Section 2 — Hero (`id="hero"`)

- **Full-bleed photo background** with dark overlay (`opacity: ~0.2`) — source: Instagram @movement_piestany, wide landscape action shot
- **Overline:** "POHYBOVÁ ŠKOLA · PIEŠŤANY" — `accent-lime`, 9px, `letter-spacing: 3px`
- **Headline:** "HÝB SA. OBJAVUJ. ROZVÍJAJ SA." — Outfit 900, ~60–80px desktop / 36–48px mobile; "ROZVÍJAJ SA." in `accent-lime`
- **Sub-text:** "Skupinové lekcie pohybovej kultúry pre začiatočníkov aj pokročilých." — `#999`, 14px
- **CTA row:**
  - Primary: "Pridaj sa na WhatsApp →" — gradient button → `https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR`
  - Secondary: "Prvá hodina zadarmo" — outline button (no link, just info)

### Section 3 — O pohybe (`id="o-pohybe"`)

- **Section label:** "O POHYBE"
- **Statement headline:** "Väčšina tréningov ťa učí ~~cviky.~~ My trénujeme schopnosť pohybovať sa."
  - "cviky." styled with `text-decoration: line-through`, `color: #777`
  - "schopnosť pohybovať sa." in `accent-lime`
- **Body paragraph:** "Pohybový tréning nie je o opakovaní šablón. Je o budovaní vnímania — schopnosti cítiť svoje telo, reagovať na situáciu a pohybovať sa prirodzene v akomkoľvek prostredí. Tréningy sú vždy iné, vždy živé."
- **Bento principle cards** (`grid-template-columns: 1fr 1fr`; VNÍMANIE uses `grid-column: 1 / 3` to span full width; ZRUČNOSŤ and SYNERGIA sit side-by-side below):
  - **VNÍMANIE** (lime, full-width): "Tréningom vnímania, nie foriem" — "Každý pohyb začína tým, čo cítiš — dych, napätie, rovnováhu, úsilie. Keď si to uvedomíš v pohybe, zlepšuješ sa vo všetkom, čo robíš."
  - **ZRUČNOSŤ** (cyan, small): "Riešiš výzvy, nie opakovanie vzorov" — "Telo sa učí prispôsobovať, nie memorovať. To ti dáva skutočnú pohybovú slobodu."
  - **SYNERGIA** (lime, small): "Pohyb s partnerom, s priestorom" — "Koordinácia s druhými je najvzácnejšia pohybová zručnosť. A zároveň najzábavnejšia."
- **Quote callout** (dark card with 💡): *"Hodiny sú vždy iné — žiadne opakovanie rovnakých cvičení. Učíme sa nové veci a postupujeme tempom, ktoré podporí rozvoj každého."* — Radovan Komár

### Section 4 — Piliere tréningov (`id="piliere"`)

- **Section label:** "PILIERE TRÉNINGOV"
- **Uniform 2×2 grid** — all 4 cards identical in size and weight (no card is highlighted):

| Card | Label colour | Title | Description |
|---|---|---|---|
| MOBILITA | lime | Kĺby, rozsah, sloboda pohybu | Postupné uvoľňovanie obmedzení — od chrbtice po členky. |
| SILA | cyan | Vlastná váha ako nástroj | Kontrola tela bez posilňovne. |
| KOORDINÁCIA & HRA | lime | Spolu je to zábavnejšie | Partnerské cvičenia, hry a výzvy. |
| LOKOMÓCIA & STOJKY | cyan | Flow, rovnováha, pohyb | Prirodzený pohyb v priestore, stojky. |

### Section 5 — Ako to vyzerá (`id="galeria"`)

- **Section label:** "AKO TO VYZERÁ"
- **Bento photo grid** (`grid-template-columns: 2fr 1fr`, `grid-template-rows: 160px 160px`):
  - **Large photo** (spans both rows): group training session — label chip "SKUPINOVÝ TRÉNING" (lime)
  - **Small photo top:** skill shot (handstand / acrobatic element) — label chip "STOJKA" (cyan)
  - **Small photo bottom:** outdoor training — label chip "OUTDOOR" (lime)
- All photos from Instagram @movement_piestany or newly photographed (see Section 7)

### Section 6 — Rozvrh & Komunita (`id="rozvrh"`)

- **Section label:** "ROZVRH & KOMUNITA"
- **Background:** `#0A0A0A`
- **Wide card** (full width): "📅 Aktuálny rozvrh" — "Rozvrh sa pravidelne aktualizuje. Vždy nájdeš aktuálne termíny v našej WhatsApp skupine." + CTA button "Otvoriť WhatsApp skupinu ↗" → WhatsApp link
- **Small card — Miesto (cyan label):** Lubyjoga · Teplická 28/112 · 921 01 Piešťany
- **Small card — Vonku (lime label):** "Aj outdoors! Podľa počasia — miesto vždy oznámené vo WhatsApp."

### Section 7 — Ceny (`id="ceny"`)

- **Section label:** "CENY"
- **3-card row** (equal thirds):
  - **Prvá hodina ZADARMO** — `background: #EDFE03`, `color: #080808` — "Príď a skús bez záväzkov"
  - **10 € / lekcia** — dark card — "1,5 hodiny"
  - **Permanentky** — dark card, `accent-cyan` title — "ČOSKORO · Opýtaj sa vo WhatsApp"

### Section 8 — Tréner (`id="trener"`)

- **Section label:** "TRÉNER"
- **Background:** `#0A0A0A`
- **Layout:** photo left (min 200×200px on mobile, up to 280×280px on desktop; `border-radius: 10px`, `border: 2px solid #EDFE03`) + text right
- **Name:** Radovan Komár — white, weight 800
- **Title:** "POHYBOVÝ PRAKTIK" — lime, 8px label style
- **Bio:** "Túžba rozvíjať sa a chuť skúšať nové veci ma priviedli v roku 2019 do pohybovej školy Crazy Monkey v Amsterdame, kde sa začala moja cesta pohybového praktika." — `#999`
- Photo source: Instagram @movement_piestany or new portrait

### Section 9 — Footer (`id="kontakt"`)

- **Background:** `#050505`
- **Left column:**
  - "MOVEMENT PIEŠŤANY" — lime, weight 800
  - Address: Lubyjoga · Teplická 28/112 · 921 01 Piešťany — `#777`
  - Links: Instagram ↗ · WhatsApp ↗ — `#888`
- **Right column:** Google Maps embed (dark-styled) — location: `https://maps.app.goo.gl/VVUUFWu8wdTSVGQx7`
- **Bottom bar:** "© 2026 Movement Piešťany" centred, `#666`

---

## 5. Photos Required

| # | Location | Description | Source |
|---|---|---|---|
| 1 | Hero background | Wide landscape — Radovan or group in motion, dark edges | Instagram / new |
| 2 | Tréner section | Radovan portrait or action shot, min 400×400px | Instagram / new |
| 3 | Galéria — large | Group class atmosphere, multiple people | Instagram / new |
| 4 | Galéria — small top | Skill shot: handstand, bridge, or acrobatic element | Instagram / new |
| 5 | Galéria — small bottom | Outdoor training session | Instagram / new |

Source: Instagram @movement_piestany. Missing shots can be newly photographed — confirm with Radovan.

---

## 6. Copy & Language Notes

- All copy in Slovak. Source text from Radovan's WordPress page requires cleanup (grammatical errors present in original).
- Key corrected forms: "tréningov" (not "tréninov"), "ROZVÍJAJ SA." (not "RÁSŤ/RASŤ")
- Tone: energetic, direct, inclusive — imperative voice in headlines, warm in body text.
- Slovak-specific: use correct diacritics throughout (Piešťany, Teplická, Komár, etc.)

---

## 7. External Links

| Target | URL |
|---|---|
| WhatsApp group | `https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR` |
| Instagram | `https://www.instagram.com/movement_piestany/` |
| Google Maps | `https://maps.app.goo.gl/VVUUFWu8wdTSVGQx7` |

---

## 8. Responsive Behaviour

- **Mobile-first** — all layouts designed for small screens first
- Nav: hamburger on mobile, horizontal on desktop
- Hero: stacked, smaller headline, CTAs full-width
- Piliere grid: 1 column on mobile, 2×2 on tablet+
- O pohybe bento: single column on mobile, asymmetric on tablet+
- Gallery bento: single column on mobile, bento on tablet+
- Pricing: stack vertically on mobile, 3-column on tablet+
- Footer: stack columns on mobile, 2-column on tablet+
