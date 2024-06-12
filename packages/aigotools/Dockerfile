FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache libc6-compat \
  && npm config set strict-ssl false \
  && npm config set fetch-retries 10 \
  && corepack enable pnpm \
  && pnpm i \
  && mv next.config.docker.js next.config.js \
  && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir .next \
  && chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD HOSTNAME="0.0.0.0" node server.js