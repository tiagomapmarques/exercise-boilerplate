# Exercise boilerplate

A production-ready React application template.

For architectural decisions and coding conventions, see
[DEVELOPMENT.md](DEVELOPMENT.md).

## Requirements

- Node 24 (LTS) or 26
- pnpm 11

## Quick start

### Development

- pnpm install
- pnpm start

### Production

- pnpm install --ignore-scripts --prod
- pnpm build
- pnpm serve

### Production (Docker)

- pnpm docker:build
- pnpm docker:run

## Stack

- **TypeScript**
- **React**
- **TanStack Router**
- **Mantine**
- **Lingui**
- **Vitest**
- **Playwright**
- **Biome**
- **Docker**

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
| `pnpm docker:build` | Build the production Docker image |
| `pnpm docker:run` | Run the production Docker image on port 8080 |
| `pnpm docker:ci` | Build CI image, run checks and extract reports |
