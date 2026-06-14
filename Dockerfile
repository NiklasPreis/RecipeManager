FROM node:20-alpine AS builder
WORKDIR /app

# Prisma-Schema VOR npm install kopieren,
# damit der @prisma/client postinstall-Hook die Schema-Datei findet
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

ENV DATABASE_URL=file:/tmp/build.db
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runtime-Image ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=file:/data/recipes.db
ENV UPLOAD_DIR=/data/uploads
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

VOLUME ["/data"]
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
