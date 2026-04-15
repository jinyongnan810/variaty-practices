# AGENTS.md

## Purpose

This repository is a single Vite app that showcases small web demos ("tricks") in a gallery and detail-view format.
Most work in this repo falls into one of three areas:

- app shell and gallery UI under `src/`
- trick registration and demo implementations under `src/data` and `src/tricks`
- end-to-end coverage under `e2e/`

Prefer repo-specific changes over generic scaffolding.

## Stack

- React 19
- React Router 7
- TypeScript 5
- Vite 8
- Tailwind CSS 4 via `@tailwindcss/vite`
- ESLint 9 flat config
- Prettier
- Playwright

## Important Paths

- `src/main.tsx`: app bootstrap with `BrowserRouter`
- `src/App.tsx`: top-level routes and gallery filter state
- `src/components/`: shared UI such as header and trick cards
- `src/pages/Gallery.tsx`: gallery listing and category-filtered grid
- `src/pages/TrickDetail.tsx`: lazy-load detail page for each trick
- `src/data/tricks.ts`: source of truth for trick metadata and lazy imports
- `src/tricks/`: one file per trick demo
- `src/tricks/legacy/LegacyExternalPage.tsx`: iframe wrapper for static legacy demos
- `src/index.css`: Tailwind import plus theme tokens and global font setup
- `public/legacy-tricks/`: static HTML/CSS/JS demos embedded via iframe
- `public/thumbnails/legacy/`: thumbnails for legacy demos
- `e2e/specs/`: hand-written Playwright specs
- `e2e/markdown/`: markdown-driven Playwright scenarios and runner
- `e2e/mcp/`: natural-language MCP scenarios
- `scripts/`: helpers for MCP E2E flows

## Architecture Notes

- The app is route-driven:
  - `/` renders the gallery
  - `/trick/:id` renders a detail page for the selected trick
- Trick discovery is not filesystem-based. `src/data/tricks.ts` is the registry.
- `TrickDetail` builds a lazy component map from that registry, so every new trick must be added there.
- There are two demo styles:
  - native React demos rendered directly from `src/tricks/*.tsx`
  - legacy demos that wrap `public/legacy-tricks/.../index.html` with `LegacyExternalPage`
- The gallery card, detail sidebar, GitHub source link, category label, and lazy import all depend on metadata in `src/data/tricks.ts`.

## Adding Or Updating A Trick

When adding a new trick, update all required touchpoints:

1. Create the demo component in `src/tricks/`.
2. If it is a legacy/static demo, add assets under `public/legacy-tricks/<Folder>/` and wrap it with `src/tricks/legacy/LegacyExternalPage.tsx`.
3. Add the trick metadata entry to `src/data/tricks.ts`:
   - unique `id`
   - title and description
   - category: `CSS`, `JS`, or `React`
   - technologies array
   - thumbnail
   - `githubUrl`
   - lazy `component` import
4. If the trick uses a legacy thumbnail or legacy source folder mapping, update:
   - `legacyThumbnailById`
   - `legacySourceFolderById`
5. Confirm the trick appears in the gallery and opens from `/trick/<id>`.
6. Add or update Playwright coverage when behavior is user-visible or stateful.

## Working Conventions

- Preserve the existing app structure. Do not introduce a new routing, state, or data-loading pattern unless the task requires it.
- Keep trick implementations self-contained. Most demos live in a single file under `src/tricks/`.
- Reuse the existing theme tokens from `src/index.css` before inventing new one-off colors.
- Match the current import style and quote style: double quotes, semicolons enabled.
- Favor accessible selectors and labels because Playwright tests rely on roles, names, and labels.
- When changing text that is user-facing, check existing E2E tests for exact string assertions.
- Do not treat generated output as source:
  - `dist/`
  - `playwright-report/`
  - `test-results/`
- Add key comments for each created project to explain the trick's essential concepts.
- When asked to add new trick. Add to the top of the tricks.
- Add concise comments to functions and components.

## Testing And Validation

Use the smallest check set that matches the change:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e:specs`
- `npm run test:e2e:md`

For broader browser validation:

- `npm run test:e2e`
- `npm run test:e2e:ui`

For MCP scenario work:

- `npm run test:e2e:mcp:prompt`
- `npm run test:e2e:mcp`

## Playwright Notes

- Playwright is configured in `playwright.config.ts`.
- Tests run against `http://127.0.0.1:4173`.
- The config starts Vite with `./node_modules/.bin/vite --host 127.0.0.1 --port 4173`.
- HTML reports are written locally and screenshots are enabled.
- Markdown scenarios are parsed by `e2e/markdown/runner.ts`, so new markdown step syntax requires runner changes.

## Common Safe Edits

- Adding a new gallery trick
- Updating trick descriptions, technologies, and source links
- Refining gallery/detail layout
- Adjusting theme tokens in `src/index.css`
- Extending Playwright specs for new visible behavior
- Updating MCP test scripts or scenario content
- Do not update e2e tests unless explictly ask to.

## Watchouts

- `src/data/tricks.ts` is large and mixes modern and legacy mappings. Edit carefully and keep IDs consistent.
- Some trick names and folder names intentionally differ from normalized IDs. Check the existing mapping objects before assuming naming conventions.
- A detail page "not found" state is expected behavior for unknown IDs and is covered by tests.
- Stateful demos such as `use-local-storage` and IME-sensitive demos such as `composition-search` already have targeted Playwright coverage; preserve those behaviors unless the task explicitly changes them.
