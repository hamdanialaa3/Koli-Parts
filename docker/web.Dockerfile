FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build --workspace=apps/web

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/package.json ./package.json
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
