ARG NODE_VERSION=24.12.0
ARG PNPM_VERSION=10.27.0

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
RUN pnpm build

# Serve application
EXPOSE 8080
CMD ["pnpm", "serve"]
