# Smartphone Store

Web application to browse, search and manage a catalog of smartphones, built for the Inditex/Zara frontend challenge: a product list with real-time API search, a product detail with storage/color configuration and live pricing, and a persistent shopping cart.

Built with **Next.js 15 (App Router) + React 19 + TypeScript** on **Node 18**, styled with **SCSS Modules + CSS variables**, state managed with the **React Context API**, and tested with **Vitest + Testing Library + MSW + axe**.

## Features

- **Catalog** — grid with the first 20 phones (image, brand, name, base price), server-side rendered.
- **Real-time search** — filters by name or brand through the API, debounced (~300 ms), URL-backed (`?search=`), with a live results counter. Refresh, back/forward and shared links keep the search.
- **Product detail** — large image that switches with the selected color, storage and color selectors with real-time price updates, full technical specifications, and a similar-products carousel. "AÑADIR" activates only once both storage and color are chosen.
- **Cart** — independent lines per configuration, per-line removal, total price, persisted in `localStorage` (survives reloads and syncs across tabs), with a live unit badge in the header.
- **Loading states** — empty screen with header plus a thin animated progress line (disabled under `prefers-reduced-motion`), faithful to the Figma "Loading"/"Unloaded" frames — no skeletons by design.
- **Responsive** — desktop / tablet / mobile layouts matching the Figma frames; no accidental horizontal scroll.
- **Accessible** — semantic landmarks, native radiogroups for the selectors, labelled controls, visible focus, `aria-live` result count, and an axe test suite over the three views.

## Requirements

- **Node.js 18.18+** (see `.nvmrc` — run `nvm use`)
- npm 9+

## Setup

```bash
cp .env.example .env   # API base URL + x-api-key (server-side only)
npm install
```

> **Note:** the API runs on Render's free tier. The first request after idle time can take up to ~60 s (cold start). This is expected; the app waits with the Figma loading state and revalidates data every 60 s afterwards.

## Development and production modes

```bash
npm run dev     # development mode: assets served unminified
npm run build   # production build: assets concatenated and minified
npm start       # serve the production build
```

## Scripts

| Script                            | Purpose                                                   |
| --------------------------------- | --------------------------------------------------------- |
| `npm run lint`                    | ESLint 9 (flat config: TypeScript, react-hooks, jsx-a11y) |
| `npm run format` / `format:check` | Prettier                                                  |
| `npm run typecheck`               | `tsc --noEmit` (strict mode)                              |
| `npm run test` / `test:watch`     | Vitest + Testing Library + MSW                            |
| `npm run test:coverage`           | Coverage report (V8)                                      |

Git hooks (husky + lint-staged) run lint/format on commit and typecheck + tests on push. CI (GitHub Actions) runs lint, format check, typecheck, tests and build on every push and pull request.

## Architecture

```
src/
├── app/                  # App Router routes (list, product/[id], cart) + loading states
├── components/           # UI components with their SCSS Modules and tests
├── context/              # CartContext (Context API + useReducer + localStorage)
├── services/             # api.ts — server-only API layer
├── styles/               # design tokens (CSS variables) + global styles
├── test/                 # Vitest setup, MSW server, fixtures, axe suite
└── types/                # API and cart domain types
```

### Key decisions

- **Next.js 15, not 16.** The brief pins the stack to Node 18; Next 16 requires Node ≥ 20.9, so Next 15 is the latest major that honours that constraint (same reasoning pins Vitest 3/Vite 6 instead of Vitest 4/Vite 8). In a real production setting today the choice would be Node 22 + Next 16.
- **SSR with the App Router** (one of the brief's optional points). Pages are Server Components that fetch data on the server. This also gives the best possible authentication story: the **`x-api-key` lives only in server code** (`services/api.ts`, guarded by the `server-only` package), is sent on every API request, and never reaches the client bundle.
- **API quirks handled in the service layer.** The API returns duplicated product ids (composite `id-index` React keys keep the console warning-free) and every `imageUrl` over `http://` (normalised to `https://` to avoid mixed content). Storage prices _replace_ the base price rather than adding to it, and `basePrice` is not always the minimum — the detail shows "From {min(storageOptions)} EUR" until a storage is selected.
- **No data-fetching library.** With two endpoints, the URL as the single source of truth for search (debounce + `router.replace` inside `useTransition`) and Next's built-in caching cover everything TanStack Query would add, while keeping the required Context API front and centre for cart state.
- **Context API + useReducer for the cart**, hydrated from `localStorage` after mount to avoid SSR hydration mismatches, written back on every change, and synced across tabs via the `storage` event.
- **No skeletons.** The Figma prototype defines loading as an empty screen with the header (frames "Loading"/"Unloaded"), so `loading.tsx` renders exactly that, enhanced only with the thin animated top line from the design's "Loading bar" layer.
- **SCSS Modules + CSS variables** (optional point of the brief): design tokens from Figma (`--color-content-high`, `--color-background-mid`, spacing, breakpoints) in `:root`, no CSS-in-JS runtime.

## Testing

92 tests across 16 files, focused on the critical logic:

- **CartContext** — add/remove, totals, persistence, malformed storage, cross-tab sync.
- **Search** — debounce, URL updates, clearing, zero results.
- **Detail pricing** — "From minimum" logic, price substitution per storage, AÑADIR enablement, image change per color.
- **View integration** — the three views rendered against MSW with real API fixtures (including the duplicated-id response).
- **Accessibility** — `vitest-axe` over the three views with zero violations.

```bash
npm run test:coverage
```

## Accessibility

Keyboard-first flows (search → cards → selectors → AÑADIR → cart), native radio groups for storage/color with the color name as accessible label, visible `:focus-visible` outlines, `aria-live` result counter, descriptive `alt` text on all images, and lazy-loaded carousel images. WCAG 2.2 AA used as the reference for contrast.
