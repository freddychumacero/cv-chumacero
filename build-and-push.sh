#!/bin/bash
# ================================================================
# build-and-push.sh
# Script para construir y publicar imágenes en Docker Hub
# Alumno: Freddy Einard Chumacero Cors - USIP 2026
#
# USO:
#   chmod +x build-and-push.sh
#   ./build-and-push.sh
# ================================================================

set -e  # Detener si hay error

echo ""
echo "============================================================"
echo " CV Personal - Freddy Chumacero"
echo " Build y publicación de imágenes en Docker Hub"
echo "============================================================"
echo ""

# Login a Docker Hub (solicita usuario y contraseña)
echo "📝 Iniciando sesión en Docker Hub..."
docker login

echo ""
echo "🔨 [1/4] Construyendo imagen del BACKEND..."
docker build -t freddychumacero/chumacero-backend:v1 ./backend
echo "✅ Backend construido"

echo ""
echo "🔨 [2/4] Construyendo imagen del FRONTEND..."
docker build -t freddychumacero/chumacero-frontend:v1 ./frontend
echo "✅ Frontend construido"

echo ""
echo "🚀 [3/4] Publicando backend en Docker Hub..."
docker push freddychumacero/chumacero-backend:v1
echo "✅ Backend publicado"

echo ""
echo "🚀 [4/4] Publicando frontend en Docker Hub..."
docker push freddychumacero/chumacero-frontend:v1
echo "✅ Frontend publicado"

echo ""
echo "============================================================"
echo " ✅ Imágenes publicadas exitosamente en Docker Hub:"
echo "    - freddychumacero/chumacero-backend:v1"
echo "    - freddychumacero/chumacero-frontend:v1"
echo ""
echo " ▶️  Para iniciar la aplicación ejecute:"
echo "    docker compose up -d"
echo ""
echo " 🌐  Luego abra: http://localhost:3000"
echo "============================================================"
echo ""
