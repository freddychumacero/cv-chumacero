# =====================================================
# Dockerfile — Backend Node.js
# Imagen base requerida: node:20-alpine
# Puerto: 4000
# =====================================================

FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (mejor cache)
COPY package.json .
RUN npm install

# Copiar código fuente
COPY index.js .

EXPOSE 4000

CMD ["node", "index.js"]
