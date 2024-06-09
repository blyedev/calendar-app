FROM node:20-slim AS build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist/calendar-app-frontend/ /usr/share/nginx/html

EXPOSE 80
