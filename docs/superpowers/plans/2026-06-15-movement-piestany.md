# Movement Piešťany Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static single-page Slovak landing website for Movement Piešťany using AstroJS + TailwindCSS, deployed as a fully pre-rendered SSG site with no backend.

**Architecture:** One Astro component per section, assembled in `src/pages/index.astro`. All colours centralised in `tailwind.config.mjs` using a nested token structure — no raw hex values in markup. Fonts self-hosted via `@fontsource-variable`.

**Tech Stack:** AstroJS 4+, TailwindCSS 3, `@astrojs/tailwind`, `@fontsource-variable/outfit`, `@fontsource-variable/inter`, Node 20+

**Design spec:** `docs/superpowers/specs/2026-06-15-movement-piestany-design.md`

---

## File Map

```
/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── hero.jpg          # Wide landscape action shot (Instagram)
│       ├── trener.jpg        # Radovan portrait (Instagram)
│       ├── galeria-1.jpg     # Group class — large bento cell (Instagram)
│       ├── galeria-2.jpg     # Skill/handstand shot (Instagram)
│       └── galeria-3.jpg     # Outdoor session (Instagram)
├── src/
│   ├── components/
│   │   ├── Nav.astro         # Sticky nav + mobile hamburger
│   │   ├── Hero.astro        # Full-bleed photo hero, headline, CTAs
│   │   ├── OPohybe.astro     # Philosophy section with bento principle cards
│   │   ├── Piliere.astro     # Training pillars uniform 2×2 grid
│   │   ├── Galeria.astro     # Bento photo gallery
│   │   ├── Rozvrh.astro      # Schedule & community cards
│   │   ├── Ceny.astro        # Pricing 3-card row
│   │   ├── Trener.astro      # Trainer profile
│   │   └── Footer.astro      # Address, links, Google Maps embed
│   ├── layouts/
│   │   └── Layout.astro      # HTML shell: lang, meta, font imports, slot
│   ├── styles/
│   │   └── global.css        # Fontsource imports + Tailwind directives
│   └── pages/
│       └── index.astro       # Assembles all components in order
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json` (via npm)

- [ ] **Step 1: Initialise Astro with the minimal template**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --install
```

Expected output ends with: `✔ Project initialised!`

- [ ] **Step 2: Add Tailwind integration**

```bash
npx astro add tailwind --yes
```

Expected: creates `tailwind.config.mjs`, updates `astro.config.mjs`.

- [ ] **Step 3: Install font packages**

```bash
npm install @fontsource-variable/outfit @fontsource-variable/inter
```

- [ ] **Step 4: Set output to static in `astro.config.mjs`**

Replace the full file content:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  output: 'static',
});
```

(`applyBaseStyles: false` lets us control Tailwind directives in our own CSS file.)

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: `Local  http://localhost:4321/` — no errors in terminal.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tailwind.config.mjs
git commit -m "feat: scaffold Astro project with Tailwind"
```

---

## Task 2: Tailwind colour tokens + fonts

**Files:**
- Modify: `tailwind.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Replace `tailwind.config.mjs` with full colour + font config**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base:   '#080808',
          card:   '#121212',
          deep:   '#0a0a0a',
          footer: '#050505',
          nav:    '#0d0d0d',
        },
        accent: {
          lime: '#EDFE03',
          cyan: '#00D8FF',
        },
        content: {
          primary:   '#ffffff',
          body:      '#999999',
          secondary: '#888888',
          label:     '#aaaaaa',
          muted:     '#777777',
        },
        stroke: {
          card:   '#1e1e1e',
          subtle: '#1a1a1a',
        },
      },
      fontFamily: {
        heading: ['"Outfit Variable"', 'sans-serif'],
        body:    ['"Inter Variable"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import '@fontsource-variable/outfit';
@import '@fontsource-variable/inter';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: theme('colors.surface.base');
    color: theme('colors.content.primary');
    font-family: theme('fontFamily.body');
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: theme('fontFamily.heading');
  }
}
```

- [ ] **Step 3: Verify no build errors**

```bash
npx astro check
```

Expected: `Found 0 errors.`

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "feat: add Tailwind colour tokens and font config"
```

---

## Task 3: Layout.astro

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Write `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}
const {
  title = 'Movement Piešťany',
  description = 'Skupinové lekcie pohybovej kultúry v Piešťanoch. Pre začiatočníkov aj pokročilých.',
} = Astro.props;
---
<!doctype html>
<html lang="sk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Update `src/pages/index.astro` to use the layout**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout>
  <p class="text-content-body p-8">Skeleton — components load here.</p>
</Layout>
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321` — page background should be `#080808` (very dark), text should be grey. Confirms colour tokens and fonts are wired.

- [ ] **Step 4: Run type check**

```bash
npx astro check
```

Expected: `Found 0 errors.`

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/pages/index.astro
git commit -m "feat: add Layout component and base page shell"
```

---

## Task 4: Nav component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
const whatsappUrl = 'https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR';
---
<header class="sticky top-0 z-50 bg-surface-nav border-b border-stroke-subtle">
  <nav class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

    <a href="#hero" class="font-heading font-extrabold text-sm tracking-widest text-accent-lime">
      MOVEMENT PIEŠŤANY
    </a>

    <!-- Desktop links -->
    <div class="hidden md:flex items-center gap-6">
      <a href="#piliere" class="text-content-secondary text-xs hover:text-content-primary transition-colors">Piliere</a>
      <a href="#rozvrh"  class="text-content-secondary text-xs hover:text-content-primary transition-colors">Rozvrh</a>
      <a href="#ceny"    class="text-content-secondary text-xs hover:text-content-primary transition-colors">Ceny</a>
      <a href="#trener"  class="text-content-secondary text-xs hover:text-content-primary transition-colors">Tréner</a>
      <a href="#kontakt" class="text-content-secondary text-xs hover:text-content-primary transition-colors">Kontakt</a>
      <a href={whatsappUrl} target="_blank" rel="noopener"
         class="bg-accent-lime text-surface-base text-xs font-bold px-3 py-1.5 rounded hover:brightness-110 transition-all">
        WhatsApp ↗
      </a>
    </div>

    <!-- Mobile: WhatsApp always visible + hamburger -->
    <div class="flex md:hidden items-center gap-3">
      <a href={whatsappUrl} target="_blank" rel="noopener"
         class="bg-accent-lime text-surface-base text-xs font-bold px-3 py-1.5 rounded">
        WhatsApp ↗
      </a>
      <button id="menu-btn" aria-label="Otvoriť menu" class="text-content-secondary">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <rect y="3" width="20" height="2" rx="1"/>
          <rect y="9" width="20" height="2" rx="1"/>
          <rect y="15" width="20" height="2" rx="1"/>
        </svg>
      </button>
    </div>
  </nav>

  <!-- Mobile dropdown -->
  <div id="mobile-menu" class="hidden md:hidden bg-surface-nav border-t border-stroke-subtle px-4 pb-4">
    <div class="flex flex-col gap-4 pt-4">
      <a href="#piliere" class="text-content-secondary text-sm hover:text-content-primary transition-colors">Piliere</a>
      <a href="#rozvrh"  class="text-content-secondary text-sm hover:text-content-primary transition-colors">Rozvrh</a>
      <a href="#ceny"    class="text-content-secondary text-sm hover:text-content-primary transition-colors">Ceny</a>
      <a href="#trener"  class="text-content-secondary text-sm hover:text-content-primary transition-colors">Tréner</a>
      <a href="#kontakt" class="text-content-secondary text-sm hover:text-content-primary transition-colors">Kontakt</a>
    </div>
  </div>
</header>

<script>
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  // Toggle menu open/close
  btn?.addEventListener('click', () => menu?.classList.toggle('hidden'));
  // Close menu when a link is clicked
  menu?.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => menu.classList.add('hidden'))
  );
</script>
```

- [ ] **Step 2: Add Nav to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
---
<Layout>
  <Nav />
  <main>
    <p class="text-content-body p-8 pt-24">Skeleton</p>
  </main>
</Layout>
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`, open `http://localhost:4321`:
- Dark sticky nav visible at top
- "MOVEMENT PIEŠŤANY" in lime on left
- "WhatsApp ↗" lime button on right (desktop)
- Resize to mobile: hamburger appears, clicking it toggles the dropdown

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat: add Nav component with mobile hamburger"
```

---

## Task 5: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
const whatsappUrl = 'https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR';
---
<section id="hero" class="relative min-h-[90vh] flex items-center bg-surface-base overflow-hidden">
  <!-- Background photo with dark overlay -->
  <div class="absolute inset-0">
    <img
      src="/images/hero.jpg"
      alt=""
      role="presentation"
      class="w-full h-full object-cover opacity-20"
      loading="eager"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-surface-base/70 via-transparent to-surface-base/90"></div>
  </div>

  <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24">
    <p class="text-accent-lime text-xs font-bold tracking-[0.3em] mb-6 font-heading">
      POHYBOVÁ ŠKOLA · PIEŠŤANY
    </p>
    <h1 class="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-content-primary">
      HÝB SA.<br>
      OBJAVUJ.<br>
      <span class="text-accent-lime">ROZVÍJAJ SA.</span>
    </h1>
    <p class="mt-6 text-content-body text-base leading-relaxed max-w-md">
      Skupinové lekcie pohybovej kultúry pre začiatočníkov aj pokročilých.
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a
        href={whatsappUrl}
        target="_blank" rel="noopener"
        class="bg-gradient-to-r from-accent-lime to-accent-cyan text-surface-base font-bold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition-all"
      >
        Pridaj sa na WhatsApp →
      </a>
      <span class="border border-content-muted text-content-secondary text-sm px-6 py-3 rounded-lg flex items-center">
        Prvá hodina zadarmo
      </span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add Hero to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
  </main>
</Layout>
```

- [ ] **Step 3: Add placeholder hero image**

```bash
mkdir -p public/images
curl -o public/images/hero.jpg "https://placehold.co/1920x900/111111/333333?text=hero+photo"
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:4321`:
- Dark section with grey placeholder background
- "POHYBOVÁ ŠKOLA · PIEŠŤANY" in lime
- Large headline with "ROZVÍJAJ SA." in lime
- Gradient CTA button + outline secondary button
- Section fills most of viewport height

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro public/images/hero.jpg
git commit -m "feat: add Hero section"
```

---

## Task 6: OPohybe component

**Files:**
- Create: `src/components/OPohybe.astro`

- [ ] **Step 1: Create `src/components/OPohybe.astro`**

```astro
---
---
<section id="o-pohybe" class="py-20 bg-surface-base border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">

    <p class="text-content-label text-xs font-bold tracking-[0.3em] mb-8 font-heading">O POHYBE</p>

    <!-- Statement headline -->
    <div class="mb-10">
      <h2 class="font-heading font-black text-3xl sm:text-4xl leading-tight tracking-tight">
        Väčšina tréningov ťa učí{' '}
        <span class="text-content-muted line-through decoration-content-muted">cviky.</span><br>
        My trénujeme{' '}
        <span class="text-accent-lime">schopnosť pohybovať sa.</span>
      </h2>
      <p class="mt-5 text-content-body text-sm leading-relaxed max-w-2xl">
        Pohybový tréning nie je o opakovaní šablón. Je o budovaní vnímania — schopnosti cítiť
        svoje telo, reagovať na situáciu a pohybovať sa prirodzene v akomkoľvek prostredí.
        Tréningy sú vždy iné, vždy živé.
      </p>
    </div>

    <!-- Bento principle cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
      <!-- VNÍMANIE: spans both columns on sm+ -->
      <div class="sm:col-span-2 bg-surface-card border border-stroke-card border-l-[3px] border-l-accent-lime rounded-xl p-6 hover:shadow-[0_0_15px_rgba(237,254,3,0.08)] transition-shadow">
        <p class="text-accent-lime text-xs font-bold tracking-[0.2em] mb-2 font-heading">VNÍMANIE</p>
        <h3 class="font-heading font-bold text-lg text-content-primary mb-3">Tréningom vnímania, nie foriem</h3>
        <p class="text-content-body text-sm leading-relaxed">
          Každý pohyb začína tým, čo cítiš — dych, napätie, rovnováhu, úsilie.
          Keď si to uvedomíš v pohybe, zlepšuješ sa vo všetkom, čo robíš.
        </p>
      </div>

      <!-- ZRUČNOSŤ -->
      <div class="bg-surface-card border border-stroke-card border-l-[3px] border-l-accent-cyan rounded-xl p-5">
        <p class="text-accent-cyan text-xs font-bold tracking-[0.2em] mb-2 font-heading">ZRUČNOSŤ</p>
        <h3 class="font-heading font-bold text-base text-content-primary mb-2">Riešiš výzvy, nie opakovanie vzorov</h3>
        <p class="text-content-body text-xs leading-relaxed">
          Telo sa učí prispôsobovať, nie memorovať. To ti dáva skutočnú pohybovú slobodu.
        </p>
      </div>

      <!-- SYNERGIA -->
      <div class="bg-surface-card border border-stroke-card border-l-[3px] border-l-accent-lime rounded-xl p-5">
        <p class="text-accent-lime text-xs font-bold tracking-[0.2em] mb-2 font-heading">SYNERGIA</p>
        <h3 class="font-heading font-bold text-base text-content-primary mb-2">Pohyb s partnerom, s priestorom</h3>
        <p class="text-content-body text-xs leading-relaxed">
          Koordinácia s druhými je najvzácnejšia pohybová zručnosť. A zároveň najzábavnejšia.
        </p>
      </div>
    </div>

    <!-- Quote callout -->
    <div class="bg-surface-deep border border-stroke-subtle rounded-xl p-5 flex gap-4 items-start">
      <span class="text-accent-lime text-2xl leading-none flex-shrink-0 mt-0.5" aria-hidden="true">💡</span>
      <blockquote class="text-content-body text-sm leading-relaxed italic">
        "Hodiny sú vždy iné — žiadne opakovanie rovnakých cvičení. Učíme sa nové veci
        a postupujeme tempom, ktoré podporí rozvoj každého."
        <cite class="not-italic text-content-secondary text-xs mt-2 block">— Radovan Komár</cite>
      </blockquote>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <OPohybe />
  </main>
</Layout>
```

- [ ] **Step 3: Verify in browser**

Scroll past hero — section appears with:
- "O POHYBE" label in `#aaa`
- Strikethrough "cviky." in muted grey, "schopnosť pohybovať sa." in lime
- VNÍMANIE card full-width with lime left border, ZRUČNOSŤ + SYNERGIA side-by-side below it
- Quote callout with 💡

- [ ] **Step 4: Commit**

```bash
git add src/components/OPohybe.astro src/pages/index.astro
git commit -m "feat: add OPohybe philosophy section with bento cards"
```

---

## Task 7: Piliere component

**Files:**
- Create: `src/components/Piliere.astro`

- [ ] **Step 1: Create `src/components/Piliere.astro`**

```astro
---
const piliere = [
  {
    label: 'MOBILITA',
    accent: 'lime' as const,
    title: 'Kĺby, rozsah, sloboda pohybu',
    desc: 'Postupné uvoľňovanie obmedzení — od chrbtice po členky.',
  },
  {
    label: 'SILA',
    accent: 'cyan' as const,
    title: 'Vlastná váha ako nástroj',
    desc: 'Kontrola tela bez posilňovne.',
  },
  {
    label: 'KOORDINÁCIA & HRA',
    accent: 'lime' as const,
    title: 'Spolu je to zábavnejšie',
    desc: 'Partnerské cvičenia, hry a výzvy.',
  },
  {
    label: 'LOKOMÓCIA & STOJKY',
    accent: 'cyan' as const,
    title: 'Flow, rovnováha, pohyb',
    desc: 'Prirodzený pohyb v priestore, stojky.',
  },
];
---
<section id="piliere" class="py-20 bg-surface-deep border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <p class="text-content-label text-xs font-bold tracking-[0.3em] mb-8 font-heading">PILIERE TRÉNINGOV</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {piliere.map(p => (
        <div class="bg-surface-card border border-stroke-card rounded-xl p-5 hover:shadow-[0_0_15px_rgba(237,254,3,0.06)] transition-shadow">
          <p class:list={[
            'text-xs font-bold tracking-[0.2em] mb-2 font-heading',
            p.accent === 'lime' ? 'text-accent-lime' : 'text-accent-cyan',
          ]}>
            {p.label}
          </p>
          <h3 class="font-heading font-bold text-base text-content-primary mb-1">{p.title}</h3>
          <p class="text-content-body text-xs leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
import Piliere from '../components/Piliere.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <OPohybe />
    <Piliere />
  </main>
</Layout>
```

- [ ] **Step 3: Verify in browser**

- 4 cards in 2×2 uniform grid (1 column on mobile, 2 on tablet+)
- MOBILITA and KOORDINÁCIA & HRA labels in lime, SILA and LOKOMÓCIA in cyan
- All cards identical in size and weight — none highlighted

- [ ] **Step 4: Commit**

```bash
git add src/components/Piliere.astro src/pages/index.astro
git commit -m "feat: add Piliere training pillars section"
```

---

## Task 8: Galeria component

**Files:**
- Create: `src/components/Galeria.astro`

- [ ] **Step 1: Add placeholder gallery images**

```bash
curl -o public/images/galeria-1.jpg "https://placehold.co/800x600/1a2a1a/333?text=skupinovy+trening"
curl -o public/images/galeria-2.jpg "https://placehold.co/400x300/1a1a2a/333?text=stojka"
curl -o public/images/galeria-3.jpg "https://placehold.co/400x300/1a150f/333?text=outdoor"
```

- [ ] **Step 2: Create `src/components/Galeria.astro`**

```astro
---
---
<section id="galeria" class="py-20 bg-surface-base border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <p class="text-content-label text-xs font-bold tracking-[0.3em] mb-8 font-heading">AKO TO VYZERÁ</p>

    <!--
      Bento layout:
      - Desktop (sm+): 3-column grid, large photo spans col 1-2 and row 1-2, two small photos in col 3
      - Mobile: stacked vertically
    -->
    <div class="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-3">

      <!-- Large photo: group training -->
      <div class="relative sm:col-span-2 sm:row-span-2 rounded-xl overflow-hidden min-h-[260px]">
        <img
          src="/images/galeria-1.jpg"
          alt="Skupinový tréning Movement Piešťany"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-surface-base/60 to-transparent pointer-events-none"></div>
        <span class="absolute top-3 left-3 bg-surface-base/80 border border-accent-lime/40 text-accent-lime text-xs font-bold px-2 py-1 rounded font-heading tracking-wider">
          SKUPINOVÝ TRÉNING
        </span>
      </div>

      <!-- Small photo: skill/handstand -->
      <div class="relative rounded-xl overflow-hidden min-h-[180px]">
        <img
          src="/images/galeria-2.jpg"
          alt="Stojka"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-surface-base/60 to-transparent pointer-events-none"></div>
        <span class="absolute top-3 left-3 bg-surface-base/80 border border-accent-cyan/40 text-accent-cyan text-xs font-bold px-2 py-1 rounded font-heading tracking-wider">
          STOJKA
        </span>
      </div>

      <!-- Small photo: outdoor -->
      <div class="relative rounded-xl overflow-hidden min-h-[180px]">
        <img
          src="/images/galeria-3.jpg"
          alt="Outdoor tréning"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-surface-base/60 to-transparent pointer-events-none"></div>
        <span class="absolute top-3 left-3 bg-surface-base/80 border border-accent-lime/40 text-accent-lime text-xs font-bold px-2 py-1 rounded font-heading tracking-wider">
          OUTDOOR
        </span>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 3: Add to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
import Piliere from '../components/Piliere.astro';
import Galeria from '../components/Galeria.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <OPohybe />
    <Piliere />
    <Galeria />
  </main>
</Layout>
```

- [ ] **Step 4: Verify in browser**

- Large photo spans 2 columns and 2 rows on desktop (bento), three photos stacked on mobile
- Each photo has a label chip in the top-left corner
- Gradient overlay fades bottom of each photo into the dark background

- [ ] **Step 5: Commit**

```bash
git add src/components/Galeria.astro src/pages/index.astro public/images/galeria-*.jpg
git commit -m "feat: add Galeria bento photo section"
```

---

## Task 9: Rozvrh component

**Files:**
- Create: `src/components/Rozvrh.astro`

- [ ] **Step 1: Create `src/components/Rozvrh.astro`**

```astro
---
const whatsappUrl = 'https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR';
---
<section id="rozvrh" class="py-20 bg-surface-deep border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <p class="text-content-label text-xs font-bold tracking-[0.3em] mb-8 font-heading">ROZVRH & KOMUNITA</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

      <!-- Wide card: schedule explanation -->
      <div class="sm:col-span-2 bg-surface-card border border-stroke-card rounded-xl p-6">
        <p class="text-content-primary font-bold text-base mb-2">📅 Aktuálny rozvrh</p>
        <p class="text-content-body text-sm leading-relaxed mb-4">
          Rozvrh sa pravidelne aktualizuje. Vždy nájdeš aktuálne termíny v našej WhatsApp skupine.
          Keď sa chceš prihlásiť na hodinu, jednoducho daj like príslušnému príspevku.
        </p>
        <a
          href={whatsappUrl}
          target="_blank" rel="noopener"
          class="inline-block bg-accent-lime text-surface-base text-xs font-bold px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          Otvoriť WhatsApp skupinu ↗
        </a>
      </div>

      <!-- Venue -->
      <div class="bg-surface-card border border-stroke-card rounded-xl p-5">
        <p class="text-accent-cyan text-xs font-bold tracking-[0.2em] mb-2 font-heading">📍 MIESTO</p>
        <p class="text-content-primary font-bold text-sm mb-1">Lubyjoga</p>
        <p class="text-content-body text-xs leading-relaxed">
          Teplická 28/112<br>921 01 Piešťany
        </p>
      </div>

      <!-- Outdoor note -->
      <div class="bg-surface-card border border-stroke-card rounded-xl p-5">
        <p class="text-accent-lime text-xs font-bold tracking-[0.2em] mb-2 font-heading">🌤 VONKU</p>
        <p class="text-content-primary font-bold text-sm mb-1">Aj outdoors!</p>
        <p class="text-content-body text-xs leading-relaxed">
          Podľa počasia — miesto vždy oznámené vo WhatsApp.
        </p>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
import Piliere from '../components/Piliere.astro';
import Galeria from '../components/Galeria.astro';
import Rozvrh from '../components/Rozvrh.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <OPohybe />
    <Piliere />
    <Galeria />
    <Rozvrh />
  </main>
</Layout>
```

- [ ] **Step 3: Verify in browser**

- Full-width "Aktuálny rozvrh" card with lime "Otvoriť WhatsApp skupinu" button
- Two equal cards below: venue address and outdoor note
- Verify WhatsApp button links to `https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR`

- [ ] **Step 4: Commit**

```bash
git add src/components/Rozvrh.astro src/pages/index.astro
git commit -m "feat: add Rozvrh schedule and community section"
```

---

## Task 10: Ceny component

**Files:**
- Create: `src/components/Ceny.astro`

- [ ] **Step 1: Create `src/components/Ceny.astro`**

```astro
---
---
<section id="ceny" class="py-20 bg-surface-base border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <p class="text-content-label text-xs font-bold tracking-[0.3em] mb-8 font-heading">CENY</p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

      <!-- Free first class -->
      <div class="bg-accent-lime rounded-xl p-6 text-center">
        <p class="font-heading font-black text-3xl text-surface-base">ZADARMO</p>
        <p class="font-bold text-xs tracking-widest mt-1 text-surface-base font-heading">PRVÁ HODINA</p>
        <p class="text-sm mt-3 text-surface-base/70">Príď a skús bez záväzkov</p>
      </div>

      <!-- Per-class price -->
      <div class="bg-surface-card border border-stroke-card rounded-xl p-6 text-center">
        <p class="font-heading font-black text-3xl text-content-primary">10 €</p>
        <p class="font-bold text-xs tracking-widest mt-1 text-content-secondary font-heading">JEDNA LEKCIA</p>
        <p class="text-content-body text-sm mt-3">1,5 hodiny</p>
      </div>

      <!-- Bundles coming soon -->
      <div class="bg-surface-card border border-stroke-card rounded-xl p-6 text-center">
        <p class="font-heading font-black text-xl text-accent-cyan">PERMANENTKY</p>
        <p class="font-bold text-xs tracking-widest mt-1 text-content-secondary font-heading">ČOSKORO</p>
        <p class="text-content-body text-sm mt-3">Opýtaj sa vo WhatsApp</p>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
import Piliere from '../components/Piliere.astro';
import Galeria from '../components/Galeria.astro';
import Rozvrh from '../components/Rozvrh.astro';
import Ceny from '../components/Ceny.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <OPohybe />
    <Piliere />
    <Galeria />
    <Rozvrh />
    <Ceny />
  </main>
</Layout>
```

- [ ] **Step 3: Verify in browser**

- 3-column row on desktop, stacked on mobile
- First card: solid lime background, "ZADARMO" in black
- Second card: dark card, "10 €" in white
- Third card: dark card, "PERMANENTKY" in cyan

- [ ] **Step 4: Commit**

```bash
git add src/components/Ceny.astro src/pages/index.astro
git commit -m "feat: add Ceny pricing section"
```

---

## Task 11: Trener component

**Files:**
- Create: `src/components/Trener.astro`

- [ ] **Step 1: Add placeholder trainer image**

```bash
curl -o public/images/trener.jpg "https://placehold.co/400x400/1a1a1a/444?text=Radovan"
```

- [ ] **Step 2: Create `src/components/Trener.astro`**

```astro
---
---
<section id="trener" class="py-20 bg-surface-deep border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <p class="text-content-label text-xs font-bold tracking-[0.3em] mb-8 font-heading">TRÉNER</p>
    <div class="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
      <img
        src="/images/trener.jpg"
        alt="Radovan Komár — pohybový praktik"
        class="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-xl border-2 border-accent-lime flex-shrink-0"
        loading="lazy"
      />
      <div>
        <h2 class="font-heading font-black text-2xl text-content-primary">Radovan Komár</h2>
        <p class="text-accent-lime text-xs font-bold tracking-[0.2em] mt-1 mb-5 font-heading">POHYBOVÝ PRAKTIK</p>
        <p class="text-content-body text-sm leading-relaxed max-w-xl">
          "Túžba rozvíjať sa a chuť skúšať nové veci ma priviedli v roku 2019 do pohybovej školy
          Crazy Monkey v Amsterdame, kde sa začala moja cesta pohybového praktika."
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add to `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
import Piliere from '../components/Piliere.astro';
import Galeria from '../components/Galeria.astro';
import Rozvrh from '../components/Rozvrh.astro';
import Ceny from '../components/Ceny.astro';
import Trener from '../components/Trener.astro';
---
<Layout>
  <Nav />
  <main>
    <Hero />
    <OPohybe />
    <Piliere />
    <Galeria />
    <Rozvrh />
    <Ceny />
    <Trener />
  </main>
</Layout>
```

- [ ] **Step 4: Verify in browser**

- Photo on left (lime border), name + title + bio on right
- On mobile: photo on top, text below
- Photo placeholder is 192×192px (w-48 h-48)

- [ ] **Step 5: Commit**

```bash
git add src/components/Trener.astro src/pages/index.astro public/images/trener.jpg
git commit -m "feat: add Trener trainer profile section"
```

---

## Task 12: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
const whatsappUrl = 'https://chat.whatsapp.com/JWNQtADUh8V0PoDMlHVVjR';
const instagramUrl = 'https://www.instagram.com/movement_piestany/';
// Dark-styled Google Maps embed: standard iframe URL + CSS invert trick
// NOTE: replace this with the proper embed URL from Google Maps:
// 1. Open https://maps.app.goo.gl/VVUUFWu8wdTSVGQx7 in a browser
// 2. Click Share → Embed a map → copy the src="..." value
// 3. Paste it here
const mapsEmbedUrl = 'https://maps.google.com/maps?q=Lubyjoga,+Teplická+28/112,+921+01+Piešťany,+Slovakia&output=embed&hl=sk&z=16';
---
<footer id="kontakt" class="bg-surface-footer border-t border-stroke-subtle">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">

      <!-- Left: address + links -->
      <div>
        <p class="font-heading font-extrabold text-sm tracking-widest text-accent-lime mb-4">MOVEMENT PIEŠŤANY</p>
        <address class="not-italic text-content-muted text-sm leading-relaxed">
          Lubyjoga<br>
          Teplická 28/112<br>
          921 01 Piešťany
        </address>
        <div class="flex gap-5 mt-5">
          <a href={instagramUrl} target="_blank" rel="noopener"
             class="text-content-secondary text-sm hover:text-content-primary transition-colors">
            Instagram ↗
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener"
             class="text-content-secondary text-sm hover:text-content-primary transition-colors">
            WhatsApp ↗
          </a>
        </div>
      </div>

      <!-- Right: dark-styled map embed -->
      <div class="rounded-xl overflow-hidden border border-stroke-card">
        <iframe
          src={mapsEmbedUrl}
          width="100%"
          height="220"
          style="border:0; filter:invert(90%) hue-rotate(180deg); display:block;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Mapa — Lubyjoga, Piešťany"
        ></iframe>
      </div>

    </div>

    <div class="border-t border-stroke-subtle mt-10 pt-6 text-center">
      <p class="text-content-muted text-xs">© 2026 Movement Piešťany</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Add Footer to `src/pages/index.astro` (final assembly)**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import OPohybe from '../components/OPohybe.astro';
import Piliere from '../components/Piliere.astro';
import Galeria from '../components/Galeria.astro';
import Rozvrh from '../components/Rozvrh.astro';
import Ceny from '../components/Ceny.astro';
import Trener from '../components/Trener.astro';
import Footer from '../components/Footer.astro';
---
<Layout title="Movement Piešťany — Pohybová škola">
  <Nav />
  <main>
    <Hero />
    <OPohybe />
    <Piliere />
    <Galeria />
    <Rozvrh />
    <Ceny />
    <Trener />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 3: Verify in browser**

- Footer has dark background (`#050505`)
- "MOVEMENT PIEŠŤANY" in lime top-left
- Address in muted grey (`#777`)
- Instagram and WhatsApp links in `#888`
- Google Maps iframe appears dark (inverted + hue-rotated)
- "© 2026 Movement Piešťany" centred at bottom

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Footer with address and dark map embed"
```

---

## Task 13: Replace placeholder images with real photos

**Files:**
- Replace: `public/images/hero.jpg`
- Replace: `public/images/trener.jpg`
- Replace: `public/images/galeria-1.jpg`
- Replace: `public/images/galeria-2.jpg`
- Replace: `public/images/galeria-3.jpg`

- [ ] **Step 1: Download or copy real photos**

Save the following files (sourced from @movement_piestany Instagram or newly taken) to `public/images/`:

| Filename | Content | Min size |
|---|---|---|
| `hero.jpg` | Wide landscape action shot — Radovan or group in motion | 1920×800px |
| `trener.jpg` | Radovan portrait or action shot | 400×400px |
| `galeria-1.jpg` | Group class atmosphere, multiple people | 800×600px |
| `galeria-2.jpg` | Skill shot: handstand, bridge, or acrobatic element | 400×400px |
| `galeria-3.jpg` | Outdoor training session | 400×400px |

Optimise each image before saving (compress to <300KB each). Tools: [squoosh.app](https://squoosh.app) or `npx sharp-cli`.

- [ ] **Step 2: Verify all images render in browser**

Run `npm run dev` and scroll through the full page:
- Hero section: background photo visible with dark overlay, text readable on top
- Gallery: three photos render in bento layout, no broken image icons
- Trainer: Radovan's photo renders with lime border

- [ ] **Step 3: Commit**

```bash
git add public/images/
git commit -m "feat: add real photos from Instagram"
```

---

## Task 14: Build verification and favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create a minimal favicon**

```bash
cat > public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#080808"/>
  <text x="4" y="24" font-size="22" font-weight="900" fill="#EDFE03" font-family="sans-serif">M</text>
</svg>
EOF
```

- [ ] **Step 2: Run type check**

```bash
npx astro check
```

Expected: `Found 0 errors.`

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: exits with code 0 and prints something like:
```
dist/ built in X.XXs
```

- [ ] **Step 4: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4321`, scroll through all sections, verify:
- No visual regressions vs dev mode
- Nav anchor links scroll to the correct section
- All external links (`target="_blank"`) open correctly
- Map embed renders in the footer

- [ ] **Step 5: Final type check**

```bash
npx astro check
```

Expected: `Found 0 errors.`

- [ ] **Step 6: Final commit**

```bash
git add public/favicon.svg
git commit -m "feat: add favicon and verify production build"
```
