FROM node:20 AS builder
RUN mkdir -p /app
RUN npm cache clear --force
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM nginx
COPY --from=builder /app/dist/spa /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]