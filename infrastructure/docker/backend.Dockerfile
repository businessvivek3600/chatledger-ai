FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/ packages/
COPY apps/backend/ apps/backend/
RUN npm install
RUN npm run build --workspace=@nexaflow/shared-types
RUN cd apps/backend && npx prisma generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["node", "apps/backend/dist/main"]
