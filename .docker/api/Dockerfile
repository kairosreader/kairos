FROM denoland/deno:2.0.5 as base

WORKDIR /app

# Copy all deno configuration files and env
COPY deno.json deno.lock .env.example ./
COPY apps/api/deno.json ./apps/api/
COPY packages/core/deno.json ./packages/core/
COPY packages/shared/deno.json ./packages/shared/
COPY packages/di/deno.json ./packages/di/
COPY packages/db/deno.json ./packages/db/
COPY packages/queue/deno.json ./packages/queue/
COPY packages/content/deno.json ./packages/content/
COPY packages/auth/deno.json ./packages/auth/

# Create a minimal root deno.json for the API
RUN echo '{\
    "workspace": [\
    "./apps/api",\
    "./packages/core",\
    "./packages/shared",\
    "./packages/di",\
    "./packages/db",\
    "./packages/queue",\
    "./packages/content",\
    "./packages/auth",\
    "./packages/usecases"\
    ]\
    }' > deno.json

# Copy source files
COPY packages/shared ./packages/shared
COPY packages/core ./packages/core
COPY packages/di ./packages/di
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue
COPY packages/content ./packages/content
COPY packages/auth ./packages/auth
COPY packages/usecases ./packages/usecases
COPY apps/api ./apps/api

# Cache dependencies
RUN cd apps/api && deno cache main.ts

# Copy helper scripts
COPY .docker/scripts/check-db.ts .docker/scripts/
COPY .docker/scripts/check-redis.ts .docker/scripts/

# Copy and setup entrypoint
COPY .docker/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

FROM base as development
WORKDIR /app/apps/api
EXPOSE ${PORT}
ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "task", "start:api:dev"]

FROM base as production
WORKDIR /app/apps/api
EXPOSE ${PORT}
ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "task", "start:api"]