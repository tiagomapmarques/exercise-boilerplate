FROM node:22.18.0-alpine

RUN npm i -g pnpm@10.15.0

COPY . /app
WORKDIR /app

RUN pnpm install --prod --ignore-scripts
RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "serve"]
