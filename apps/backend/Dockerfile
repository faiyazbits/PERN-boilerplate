FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/backend/package.json ./apps/backend/package.json
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

FROM deps AS dev
ENV NODE_ENV=development
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
RUN pnpm --filter @haber/backend exec prisma generate
WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["node", "-r", "@swc/register", "src/index.ts"]

FROM deps AS builder
COPY packages/shared ./packages/shared
RUN pnpm --filter @haber/shared build
COPY apps/backend ./apps/backend
RUN pnpm --filter @haber/backend exec prisma generate
RUN pnpm --filter @haber/backend build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["node", "dist/index.js"]
