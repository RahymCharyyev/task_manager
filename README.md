# Mini Task Manager

A small **React + TypeScript** SPA that demonstrates a simplified issue/task workflow with **MobX**, **TanStack Query**, **GraphQL** (`graphql-request`), **React Router**, **Ant Design**, and **Tailwind CSS**.

Live-ish data comes from **[GraphQLZero](https://graphqlzero.almansi.me)** (JSONPlaceholder-backed todos). Tasks in the UI are mapped from GraphQL `Todo` nodes (status, priority, and dates are partly derived or synthetic).

## Features

- **Mock auth** — email/password form stores a token in `sessionStorage`; protected routes.
- **Task list** — GraphQL query, loading skeleton, error + retry.
- **MobX** — `authStore`, `taskStore` with filters and computed `filteredTasks`.
- **Mutations** — create / update (optimistic status) / delete with confirmations where appropriate.
- **Task detail** — `/tasks/:id`.
- **Theming** — light/dark via Ant Design `ConfigProvider` + Tailwind `dark:` (class on `<html>`), persisted as `tm_theme_mode`.

## Tech Stack

| Area | Libraries |
|------|-----------|
| UI | React 19, Ant Design 6, Tailwind CSS 4 |
| State | MobX 6, mobx-react-lite |
| Server cache | TanStack Query 5 |
| API | graphql, graphql-request |
| Routing | react-router-dom 7 |
| Build | Vite 8, TypeScript 6 |

React Compiler is enabled via `@vitejs/plugin-react` + `babel-plugin-react-compiler`.

## Project Structure

```txt
src/
  api/           # GraphQL callers & Todo → Task mapping
  components/    # Filters, list, cards, modals, theme toggle, skip link
  graphql/       # Operation strings & GraphQLClient
  hooks/         # useTasksQuery, mutations (sync with MobX where needed)
  layouts/       # Dashboard shell (sidebar + header)
  pages/         # Login, dashboard, task detail
  routes/        # AppRoutes + protected layout
  stores/        # authStore, taskStore, themeStore
  types/         # Task, filters, inputs
  utils/         # Date formatting, labels
  test-utils.tsx # reusable render helpers for component tests
```

## Architecture

- `src/api` contains GraphQL request wrappers and domain mapping from `Todo` nodes to app `Task` objects.
- `src/hooks` exposes query/mutation hooks that keep TanStack Query and MobX state in sync.
- `src/stores` holds application state with MobX and provides derived state like filtered tasks.
- `src/components` contains reusable UI pieces such as cards, filters, modals, and shared controls.
- `src/pages` assembles pages from components and handles route-level flows.
- `src/routes` contains application routing and protected route rules.
- `src/utils` contains small helpers for formatting and display labels.

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # tsc + production bundle
npm run preview   # Serve dist
npm run lint      # ESLint
npm run test      # Run Vitest suite
npm run test:watch # Run Vitest in watch mode
```

## Testing

Testing is built with Vitest and React Testing Library. New coverage includes:

- Unit tests for `taskStore`, `TaskCard`, `TaskFilters`, and `TaskList`
- Integration tests for search/filter interactions and task creation UI
- Global setup in `src/setupTests.ts`
- Test utilities in `src/test-utils.tsx`

## Configuration

### GraphQL endpoint

By default the client uses:

`https://graphqlzero.almansi.me/api`

Override with an env variable (e.g. `.env.local`):

```bash
VITE_GRAPHQLZERO_URL=https://your-proxy-or-api.example/graphql
```

**Note:** GraphQLZero is a public demo API. Create/update/delete affect shared data and IDs may not match a private backend.

### Theme

- Ant Design: `defaultAlgorithm` / `darkAlgorithm`.
- Tailwind: `@custom-variant dark` targets `.dark` on `<html>` (set by `themeStore`).

## Requirements

- Node.js compatible with Vite 8 (modern LTS recommended).

## License

Private / demo project (`"private": true` in `package.json`).
