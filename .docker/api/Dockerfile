FROM denoland/deno:2.0.5 as base

WORKDIR /app

# Install minimal dependencies required for jsdom
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    && rm -rf /var/lib/apt/lists/*

# Copy all deno configuration files and env
COPY deno.json deno.lock .env.example ./
COPY apps/api/deno.json apps/api/deno.lock ./apps/api/
COPY packages/core/deno.json ./packages/core/
COPY packages/infra/deno.json ./packages/infra/
COPY packages/shared/deno.json ./packages/shared/

# Create a minimal root deno.json for the API
RUN echo '{\
    "tasks": {\
    "start": "deno run -A main.ts",\
    "dev": "deno run -A --watch main.ts"\
    },\
    "workspace": [\
    "./apps/api",\
    "./packages/core",\
    "./packages/infra",\
    "./packages/shared"\
    ]\
    }' > deno.json

# Copy source files
COPY packages/shared ./packages/shared
COPY packages/core ./packages/core
COPY packages/infra ./packages/infra
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
CMD ["deno", "task", "start:api"]

FROM base as production
WORKDIR /app/apps/api
EXPOSE ${PORT}
ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "task", "start:api"]