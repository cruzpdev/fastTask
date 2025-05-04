# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve com Nginx
FROM nginx:stable-alpine

# copia os arquivos estáticos do build
COPY --from=builder /app/dist /usr/share/nginx/html

# sobrescreve o default.conf do Nginx pelo seu
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
