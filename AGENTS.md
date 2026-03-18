# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router site. Application entry points live in `src/app`, including the contact API route at `src/app/api/contact/route.ts`. Reusable UI sections live in `src/components`, with navigation-specific pieces under `src/components/navigation` and shared hooks under `src/hooks`. Localization messages are stored in `messages/*.json`. Static images and logos belong in `public/images`. Use the `@/*` TypeScript path alias for imports from `src`.

## Build, Test, and Development Commands
Use Node `>=22` as defined in `package.json`.

- `npm install`: install dependencies.
- `npm run dev`: start the local dev server on `http://localhost:8000`.
- `npm run build`: produce a production build with Next.js.
- `npm run start`: serve the built app.
- `npm run lint`: run ESLint with the Next.js flat config.
- `npm run typecheck`: run `tsc --noEmit` in strict mode.

Docker-based setup notes exist in `docs/dev.md`, but the current day-to-day workflow is the npm script set above.

## Coding Style & Naming Conventions
Write TypeScript with strict typing and functional React components. Follow the existing style: double quotes, semicolons, and 2-space indentation in config files and JSX/TSX. Name React components in `PascalCase` (`AreaHero.tsx`), hooks in `camelCase` with a `use` prefix (`useScrollReveal.ts`), and keep message keys stable across `messages/en.json`, `messages/ja.json`, and `messages/ko.json`. Prefer small, section-oriented components over large page files.

## Testing Guidelines
There is no committed automated test suite yet. Before opening a PR, run `npm run lint` and `npm run typecheck` and verify the main page plus `/api/contact` changes manually. When adding tests later, place them next to the feature or under `src/__tests__`, and use `*.test.ts` or `*.test.tsx`.

## Feature Specification & Task Management
When adding a new feature, create a specification and task file under `docs/spec-and-task/[YYYYMMDD]-[feature-name]/`:
- `specification.md` — feature overview, architecture, directory structure, constraints
- `task.md` — phased task checklist with checkboxes

Example: `docs/spec-and-task/20260318-blog/specification.md`, `docs/spec-and-task/20260318-blog/task.md`

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit messages such as `add CI workflow and dependabot configuration` and `fix Navigation hydration and remove unused import`. Keep commits focused and descriptive. PRs should explain the user-visible change, note config or environment updates, link the relevant issue when available, and include screenshots for UI changes. Mention the verification steps you ran in the PR body.
