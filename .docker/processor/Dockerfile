FROM denoland/deno:2.0.5 as base

WORKDIR /app

# Install minimal dependencies required for jsdom (used by ReadabilityService)
RUN apt-get update && apt-get install -y \
    libnss3 \
    && rm -rf /var/lib/apt/lists/*

# Copy all deno configuration files and env
COPY deno.json deno.lock .env.example ./
COPY apps/content-processor/deno.json ./apps/content-processor/
COPY packages/core/deno.json ./packages/core/
COPY packages/shared/deno.json ./packages/shared/
COPY packages/di/deno.json ./packages/di/
COPY packages/db/deno.json ./packages/db/
COPY packages/queue/deno.json ./packages/queue/
COPY packages/content/deno.json ./packages/content/

# Create a minimal root deno.json for the content processor
RUN echo '{\
    "workspace": [\
    "./apps/content-processor",\
    "./packages/core",\
    "./packages/shared",\
    "./packages/di",\
    "./packages/db",\
    "./packages/queue",\
    "./packages/content"\
    ]\
    }' > deno.json

# Copy source files
COPY packages/shared ./packages/shared
COPY packages/core ./packages/core
COPY packages/di ./packages/di
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue
COPY packages/content ./packages/content
COPY apps/content-processor ./apps/content-processor

# Cache dependencies
RUN cd apps/content-processor && deno cache main.ts

# Copy helper scripts
COPY .docker/scripts/check-db.ts .docker/scripts/
COPY .docker/scripts/check-redis.ts .docker/scripts/

# Copy and setup entrypoint
COPY .docker/processor/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

FROM base as development
WORKDIR /app/apps/content-processor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "task", "start:processor:dev"]

FROM base as production
WORKDIR /app/apps/content-processor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "task", "start:processor"]
