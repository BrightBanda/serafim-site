# Serafim — landing page

Marketing site for **Serafim**, a free real-time messaging and social
discovery app by Binary Forge.

Built with [Astro](https://astro.build). Static output, no client framework,
no runtime JavaScript beyond a theme toggle and a scroll reveal.

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Start the dev server on `localhost:4321`       |
| `npm run build`   | Build the site to `dist/`                      |
| `npm run preview` | Serve the production build locally            |
| `npx astro check` | Type-check the components (asks to install `@astrojs/check`) |

## Structure

```
src/
├── components/          One component per section of the page
│   ├── Hero.astro         Headline, calls to action, chat-list mockup
│   ├── Features.astro     The nine headline features
│   ├── Screens.astro      Conversation, group and profile mockups
│   ├── Discover.astro     Interest catalog and the Discover tab
│   ├── Privacy.astro      Privacy settings panel
│   ├── Network.astro      Edge network, device support, local-first
│   ├── Free.astro         Pricing comparison
│   ├── Download.astro     Install steps and platform status
│   ├── Faq.astro          Questions
│   ├── Icon.astro         Inline stroke icon set (no icon font)
│   └── SerafimMark.astro  The logo, as SVG
├── layouts/
│   └── Base.astro       Head, navigation, footer, theme script
├── pages/
│   ├── index.astro      The landing page
│   ├── privacy.astro    Privacy policy
│   └── terms.astro      Terms of use
├── styles/
│   └── global.css       Design tokens and every shared class
└── site.ts              App facts and the interest catalog
```

## Design

The visual language is copied from the Flutter app so the site and the
product feel like the same thing. The source of truth is
`lib/src/utils/themes/app_colors.dart` in the app repository, and the shape
rules are documented in `docs/admin-dashboard-README.md` §11.

**Colours** — every token in `global.css` maps to an `AppColors` value:

| Token         | Dark     | Light    | Use                        |
| ------------- | -------- | -------- | -------------------------- |
| `ink`         | `#0C0D11` | `#FFFFFF` | Deepest background          |
| `paper`       | `#15161C` | `#F1F2F7` | Page background             |
| `paper-alt`   | `#1A1B22` | `#FFFFFF` | Cards                       |
| `paper-raised`| `#20222A` | `#E6E9F3` | Raised rows, chips          |
| `line`        | `#1C2440` | `#1C2440` | Borders and hard shadows    |
| `line-soft`   | `#33395C` | `#B9BFD6` | Dividers, unselected chips  |
| `primary`     | `#5B7FD6` | `#4A6FC8` | Brand blue                  |
| `primary-deep`| `#3D5AAD` | `#2F4A9A` | Gradient end, pressed state |
| `primary-pale`| `#A9C0F0` | `#30479A` | Eyebrows, links, logo       |
| `rust`        | `#B3562F` | `#B3562F` | Danger                      |
| `teal`        | `#3F7D78` | `#3F7D78` | Healthy / success           |
| `text`        | `#D7D9E2` | `#1B1E2B` | Primary text                |
| `text-dim`    | `#8A8D9C` | `#5B6075` | Secondary text              |

**Type** — Bangers for display headings, Inter for body and UI, JetBrains
Mono for uppercase eyebrow labels and machine-readable values.

**Shape** — flat corners everywhere (only avatars are round), 2px borders,
and hard unblurred offset shadows in the `line` colour. The 4pt spacing grid
is respected throughout.

**Theme** — dark by default, with a light theme and a toggle in the header.
The choice is stored in `localStorage` and applied before first paint so the
page never flashes.

## Content

Everything on the site is taken from the app itself, not invented:

- The logo is the real slab geometry from `serafim_mark.dart`, redrawn as
  SVG so it stays sharp and needs no image request.
- The interest catalog in `src/site.ts` is the full list from
  `interest_catalog.dart` — 9 categories, 89 interests.
- The privacy section describes real behaviour: chat media stays on the
  device, passwords never reach the app's own servers, and there is no ad or
  analytics SDK.
- The app is distributed as a signed APK from its GitHub releases, so the
  download section links there rather than to a store.

## Deployment

Static output — build with `npm run build` and serve `dist/` from any host.
`astro.config.mjs` sets `site: 'https://serafim.app'`, which is what the
canonical and Open Graph URLs are built from. Change it if the domain
changes.
