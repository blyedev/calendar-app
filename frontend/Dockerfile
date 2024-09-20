FROM node:22-slim AS dev
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

EXPOSE 4200

CMD ["npm", "start"]

FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine AS prod

COPY --from=build /app/dist/calendar-app-frontend/browser/ /usr/share/nginx/html

EXPOSE 80
