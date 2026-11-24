# syntax=docker/dockerfile:1

# ---------- Etapa 1: dependencias ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Etapa 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Las NEXT_PUBLIC_* se graban en el código al compilar: entran como build-args.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "Falta NEXT_PUBLIC_API_URL" >&2; exit 1)
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN npm run build

# ---------- Etapa 3: imagen final ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
