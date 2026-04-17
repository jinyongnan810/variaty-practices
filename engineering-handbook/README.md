# Engineering Handbook

React + TypeScript + Vite app for a static engineering study handbook.

Current status:

- Phases 1 through 9 are implemented.
- Starter content is generated from `jira-api/create_learning_epic.py`.
- The localhost utility page exports page files for manual placement or editing.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run format`
- `npm run preview`
- `npm run generate:content`

## Content Structure

Generated content lives under `content/pages/<slug>/`:

- `why-it-matters.md`
- `learning-goals.md`
- `learning-memo.md`
- `example.py`

The metadata index lives at `content/index.json`.

## Localhost Utility

The route `/local/edit` is intended for local development only.

- It can prefill fields from an existing page.
- It renders markdown and python previews side by side.
- It exports files for manual placement into the repo.

There is no direct browser-to-repo file write in this version.
