# =====================================================
# Dockerfile — Frontend React + Nginx
# Multi-stage build:
#   Etapa 1 (build): node:20-alpine → npm run build
#   Etapa 2 (serve): nginx:1.27-alpine
# Puerto expuesto: 80 (mapeado a 3000 por Docker Compose)
# =====================================================

# --- Etapa 1: Construir la aplicación React ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .
RUN npm install

COPY public/ ./public/
COPY src/    ./src/

RUN npm run build

# --- Etapa 2: Servir el build con Nginx ---
FROM nginx:1.27-alpine

# Copiar el build generado
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
