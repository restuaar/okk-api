FROM node:18-alpine AS base
ENV NEXT_TELEMETRY_DISABLED 1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

COPY prisma ./prisma

RUN pnpx prisma generate
RUN pnpm build
RUN pnpm prune --prod --ignore-scripts

FROM base AS deploy

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/prisma/ ./prisma/
COPY --from=build /app/node_modules ./node_modules
RUN pnpm add ts-node --save-dev

CMD ["pnpm", "start:migrate:prod"]
