FROM node:22-slim AS install
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM install AS pre-build

COPY . .

FROM pre-build AS test

RUN npm run test -- --ci

FROM pre-build AS lint

RUN npm run lint

FROM pre-build AS build

RUN npm run build

FROM install AS dev

EXPOSE 4200

CMD ["npm", "start"]

FROM nginx:alpine AS prod

COPY --from=build /app/dist/calendar-app-frontend/browser/ /usr/share/nginx/html

EXPOSE 80
