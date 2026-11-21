# Exercise boilerplate

A production-ready React application template.

For architectural decisions and coding conventions, see
[DEVELOPMENT.md](DEVELOPMENT.md).

## Requirements

- node ^24.22.3 (LTS) or ^26.13.1
- pnpm ^12.21.0

## Quick start

### Development

- pnpm install
- pnpm start

> [!NOTE]
> In order to run the e2e tests, Playwright's OS-level browser dependencies must
> be installed once with `pnpm exec playwright install-deps` (needs sudo) after
> running `pnpm install`.

### Production

- pnpm install --ignore-scripts --prod
- pnpm build
- pnpm serve

### Production (Docker)

- pnpm docker:build
- pnpm docker:run

## Configuration

`pnpm install` creates `.env` from `.env.example`; the production flow installs
with `--ignore-scripts`, so copy it yourself there, or pass the variables in the
environment.

### `VITE_BASE_PATH`

Becomes Vite's `base` at build time, and so `import.meta.env.BASE_URL`, from
which the router's basepath and every asset URL are built. A missing trailing
slash is added. Defaults to `/`.

`pnpm serve` reads it again at startup, from the environment or `.env` only, to
serve the build under that path - keep it out of mode-specific `.env.*` files,
or the build and the server disagree. For the Docker image, pass it as a build
argument: `pnpm docker:build --build-arg VITE_BASE_PATH=/path/`.

## Stack

- **TypeScript**
- **React**
- **Vite**
- **TanStack Router**
- **Mantine**
- **Lingui**
- **Biome**
- **Vitest**
- **Playwright**
- **Docker**

## Scripts

| Script                      | Purpose                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm start`                | Dev server with HMR                                                                |
| `pnpm build`                | Production build                                                                   |
| `pnpm serve`                | Serve the built output                                                             |
| `pnpm build:watch`          | Production build in watch mode and serve simultaneously                            |
| `pnpm test`                 | Run all unit/integration tests once, bail on first failure                         |
| `pnpm test:watch`           | Run all unit/integration tests in watch mode                                       |
| `pnpm test:e2e`             | Run all e2e tests once                                                             |
| `pnpm test:e2e:watch`       | Run all e2e tests in watch mode                                                    |
| `pnpm typecheck`            | Type check source code and tests                                                   |
| `pnpm lint`                 | Lint and format source code and tests (writes fixes)                               |
| `pnpm lint:rewrite`         | Update `biome.json` after bumping `@biomejs/biome`                                 |
| `pnpm i18n`                 | Extract and compile translations                                                   |
| `pnpm check`                | Full project health check (run before pushing)                                     |
| `pnpm check:ci`             | Full CI health check (install → project → runtime → engines → uncommitted changes) |
| `pnpm dependencies`         | Interactive version upgrades                                                       |
| `pnpm dependencies:update`  | Automatically upgrade minor/patch versions                                         |
| `pnpm dependencies:rewrite` | Rewrite the lock file to upgrade deep dependencies                                 |
| `pnpm docker:build`         | Build the production Docker image                                                  |
| `pnpm docker:run`           | Run the production Docker image on port 8080                                       |
| `pnpm docker:ci`            | Build CI image, run checks and extract reports                                     |
| `pnpm run licenses`         | Write the dependency license reports (`licenses.json`, `licenses.prod.json`)       |
