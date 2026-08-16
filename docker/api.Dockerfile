FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
