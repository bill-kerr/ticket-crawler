FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm run build

FROM buildkite/puppeteer
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --quiet --only=production
COPY --from=builder /app/dist ./dist
ENTRYPOINT [ "npm", "run", "start" ]