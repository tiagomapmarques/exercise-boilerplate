# Exercise boilerplate

A production-ready React application template. For architectural decisions and
coding conventions, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Stack

- **React** + TypeScript
- **TanStack Router** — file-based routing with automatic code splitting
- **Mantine** — component library with CSS modules
- **Lingui** — i18n with PO file support
- **Vitest** — browser-mode unit and integration testing via Playwright
- **Playwright** — end-to-end testing
- **Biome** — linting and formatting
- **Docker** — multi-stage production builds

## Requirements

- Node 24 (LTS) or 26
- pnpm

## Quick start

### Development

- pnpm i
- pnpm start

### Production

- pnpm i --prod
- pnpm build
- pnpm serve

### Production (Docker)

- pnpm docker:build
- pnpm docker:run

## Scripts

| Script | Purpose |
|---|---|
| `pnpm start` | Dev server with HMR |
| `pnpm build` | Production build |
| `pnpm serve` | Serve the built output |
| `pnpm build:watch` | Production build in watch mode and serve simultaneously |
| `pnpm test` | Run all unit/integration tests once, bail on first failure |
| `pnpm test:watch` | Run all unit/integration tests in watch mode |
| `pnpm test:e2e` | Run all e2e tests once |
| `pnpm test:e2e:watch` | Run all e2e tests in watch mode |
| `pnpm typecheck` | Type check source code and tests |
| `pnpm lint` | Lint and format source code and tests (writes fixes) |
| `pnpm lint:rewrite` | Update `biome.json` after bumping `@biomejs/biome` |
| `pnpm i18n` | Extract and compile translations |
| `pnpm check` | Full project health check (run before pushing) |
| `pnpm check:ci` | Full CI health check (install → project → runtime → engines → uncommitted changes) |
| `pnpm dependencies` | Interactive version upgrades |
| `pnpm dependencies:update` | Automatically upgrade minor/patch versions and refresh lock file |
| `pnpm docker:ci` | Build CI image, run checks and extract reports |

## Compatibility

Production build targets the `defaults` browserslist query — single modern
bundle with polyfills injected, no ES5 fallback. IE11 is not supported.

`@types/node` tracks Node 26 for local typings — avoid Node 26-only APIs in
production code paths, the Docker build runs Node 24 LTS.
