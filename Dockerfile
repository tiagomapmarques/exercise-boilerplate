ARG NODE_VERSION=24.15.0
ARG PNPM_VERSION=11.0.3

FROM alpine AS cache

RUN apk add --no-cache jq

# Remove "version" from package.json file
WORKDIR /cache
COPY ./package.json /tmp
RUN jq 'del(.version)' < /tmp/package.json > /cache/package.json

FROM node:${NODE_VERSION}-alpine AS base-image

# Install pnpm
ARG PNPM_VERSION
RUN npm i -g "pnpm@${PNPM_VERSION}"

FROM base-image AS runner

WORKDIR /app

# Install dependencies
COPY --from=cache /cache/package.json /app
COPY ./.npm* /app
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

# Serve application
EXPOSE 8080
CMD ["pnpm", "serve"]
