FROM node:16-alpine AS build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist/maweb-pms-frontend/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use arguments to create certificate files
ARG ORIGIN_CA_CERT
ARG ORIGIN_CA_KEY
RUN mkdir -p /etc/nginx/ssl \
    && echo "$ORIGIN_CA_CERT" > /etc/nginx/ssl/origin_ca_cert.pem \
    && echo "$ORIGIN_CA_KEY" > /etc/nginx/ssl/origin_ca_key.pem \
    && chmod 600 /etc/nginx/ssl/origin_ca_cert.pem /etc/nginx/ssl/origin_ca_key.pem

EXPOSE 80
EXPOSE 443
