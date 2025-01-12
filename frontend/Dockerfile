# ===========================
# Development Stage
# ===========================
FROM node:22.13.0-slim AS dev
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]

# ===========================
# Build Stage
# ===========================
FROM node:22.13.0-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# ===========================
# Production Stage
# ===========================
FROM nginx:1.27.3-alpine AS prod

COPY --from=build /app/dist/calendar-app-frontend/browser/ /usr/share/nginx/html

EXPOSE 80
