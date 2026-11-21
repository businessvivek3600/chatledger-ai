FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/ packages/
COPY apps/web/ apps/web/
RUN npm install
RUN npm run build --workspace=@nexaflow/shared-types
RUN cd apps/web && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=@nexaflow/web"]
