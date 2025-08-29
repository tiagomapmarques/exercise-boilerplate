FROM alpine AS cache

WORKDIR /cache
RUN apk add --no-cache jq

COPY ./package.json /tmp

RUN jq 'del(.version)' < /tmp/package.json > /cache/package.json

FROM node:22.18.0-alpine AS app

WORKDIR /app
RUN npm i -g pnpm@10.15.0

COPY --from=cache /cache/package.json /app
COPY ./.npm* /app
COPY ./pnpm-* /app
RUN pnpm install --prod --ignore-scripts

COPY . /app
RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "serve"]
