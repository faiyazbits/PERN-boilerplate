FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

FROM deps AS dev
ENV NODE_ENV=development
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]

FROM deps AS builder
COPY packages/shared ./packages/shared
RUN pnpm --filter @haber/shared build
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
RUN npx vite build

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
