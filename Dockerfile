FROM node:latest as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base as build
COPY --link . .
RUN pnpm install

WORKDIR /app/frontend
RUN pnpm install -P false
RUN pnpm run build

WORKDIR /app
EXPOSE 3000
CMD [ "pnpm", "start" ]