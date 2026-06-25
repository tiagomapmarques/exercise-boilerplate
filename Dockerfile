ARG NODE_VERSION=24.18.0
ARG PNPM_VERSION=11.9.0
ARG ALPINE_VERSION=3.24

FROM alpine:${ALPINE_VERSION} AS cache

RUN apk add --no-cache jq

# Remove "version" from package.json so version bumps don't invalidate the pnpm install cache layer
WORKDIR /cache
COPY ./package.json /tmp
RUN jq 'del(.version)' < /tmp/package.json > /cache/package.json

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base-image

# Install pnpm
ARG PNPM_VERSION
RUN npm i -g "pnpm@${PNPM_VERSION}"

FROM base-image AS runner

WORKDIR /app

# Install dependencies
COPY --from=cache /cache/package.json /app
COPY ./pnpm-* /app
RUN pnpm install --ignore-scripts --prod

# Build application
COPY . /app
# `package.json` file was updated to an unchanged version with the previous
# COPY command. Since pnpm re-runs the install command if that file is changed,
# we need to manually re-run the install command to prevent postinstall scripts
# from being run. This will both let docker cache the `node_modules` folder
# in the previous RUN command and prevent potentially dangerous code to run.
RUN pnpm install --ignore-scripts --prod
RUN pnpm build
RUN chown -R node:node /app

# Serve application
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["pnpm", "serve"]
