# Web Tricks

This folder contains a React app that showcases small, practical web development tricks in a clean gallery format.
Deployed on: https://variaty-practices.vercel.app

## What this folder does

- Displays a gallery of bite-sized CSS, JavaScript, and React demos.
- Lets users filter demos by category on the home page.
- Opens each demo on a dedicated detail route with:
  - a live interactive example
  - a short explanation
  - a link to the source file on GitHub
- Uses lazy-loading for demo components so pages load faster.

## Core tech used in this project

- React 19
- React Router 7
- TypeScript 5
- Vite 8
- Tailwind CSS 4
- ESLint 9 + `typescript-eslint` + React Hooks/Refresh plugins
- Prettier
- Fontsource (`@fontsource/inter`, `@fontsource/outfit`)
- Icon libraries (`lucide-react`, `simple-icons`)
- `iframe`-based embedding for migrated legacy demos served from `public/legacy-tricks`

## Scripts

- `npm run dev` - start local development server
- `npm run build` - type-check build and generate production bundle
- `npm run preview` - preview production build locally
- `npm run lint` - run lint checks
- `npm run typecheck` - run TypeScript checks
- `npm run format` - format project files
