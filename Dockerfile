FROM node:25.8-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --omit=dev --silent && mv node_modules ../node_modules_final


FROM debian:trixie-slim
WORKDIR /app
COPY --from=builder /node_modules_final ./node_modules

RUN apt update && apt install -y chromium nodejs

COPY ./main.js .
COPY ./server.js .
COPY ./public ./public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["/bin/sh", "-c", "node main.js & node server.js"]