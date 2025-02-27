FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --production --omit=dev

EXPOSE 4173
CMD ["npm", "run", "preview"]