FROM node:latest 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --link . .
RUN pnpm install

WORKDIR /app/frontend
RUN rm -rf node_modules
RUN pnpm install -P false
RUN pnpm run build

WORKDIR /app
EXPOSE 3000
CMD [ "pnpm", "start" ]