# Práctica Final 2026
## Aplicación Web CV Personal con Docker Compose

---

| Campo | Detalle |
|---|---|
| **Alumno** | Freddy Einard Chumacero Cors |
| **Programa** | Diplomado Full Stack Developer Back End Front End |
| **Institución** | USIP |
| **Fecha de entrega** | Mayo 2026 |
| **Repositorio GitHub** | https://github.com/freddychumacero/cv-chumacero |

---

## 1. Repositorio GitHub

**URL de descarga del proyecto:**

```
https://github.com/freddychumacero/cv-chumacero
```

**Comando para clonar y ejecutar:**

```bash
git clone https://github.com/freddychumacero/cv-chumacero.git
cd cv-chumacero
docker compose up -d
```

**Acceso a la aplicación:**

```
http://localhost:3000
```

---

## 2. Imágenes publicadas en Docker Hub

| Servicio | Imagen | Etiqueta |
|---|---|---|
| Frontend (React + Nginx) | `freddychumacero/chumacero-frontend` | `v1` |
| Backend (Node.js) | `freddychumacero/chumacero-backend` | `v1` |

**URL Docker Hub:**

- https://hub.docker.com/r/freddychumacero/chumacero-frontend
- https://hub.docker.com/r/freddychumacero/chumacero-backend

---

## 3. Arquitectura de la Solución

### Servicios

| Servicio | Tecnología | Imagen base | Puerto |
|---|---|---|---|
| `frontend` | React + Nginx | `nginx:1.27-alpine` | 3000 |
| `backend` | Node.js + Express | `node:20-alpine` | 4000 |
| `database` | MySQL | `mysql:8.0` | 3306 |

### Diagrama de flujo

```
Usuario
  │
  ▼
http://localhost:3000
  │
  ▼
┌─────────────────────────────────────────────┐
│              Red: cv_network                │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │   frontend   │───►│    backend       │   │
│  │ React+Nginx  │    │  Node.js :4000   │   │
│  │   :3000      │    │  GET /cv         │   │
│  └──────────────┘    └────────┬─────────┘   │
│                               │             │
│                      ┌────────▼─────────┐   │
│                      │    database      │   │
│                      │  MySQL 8.0 :3306 │   │
│                      │  cv_db           │   │
│                      └──────────────────┘   │
└─────────────────────────────────────────────┘
         Volumen: mysql_data (persistencia)
```

---

## 4. Estructura del Proyecto

```
cv-chumacero/
├── docker-compose.yml          ← Orquestación completa
├── build-and-push.sh           ← Script de build y publicación
├── .gitignore
├── database/
│   └── init.sql                ← Creación automática de BD y datos
├── backend/
│   ├── Dockerfile              ← node:20-alpine
│   ├── package.json            ← express, mysql2, cors
│   └── index.js                ← API REST: GET /cv
└── frontend/
    ├── Dockerfile              ← Multi-stage: node:20-alpine + nginx:1.27-alpine
    ├── nginx.conf              ← Configuración SPA
    ├── package.json            ← React 18
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js              ← Componente CV
        └── index.js
```

---

## 5. Base de Datos

### Script de inicialización automática

**Archivo:** `database/init.sql`  
**Ruta en contenedor:** `/docker-entrypoint-initdb.d/init.sql`

El script se ejecuta automáticamente al iniciar el contenedor MySQL sin ninguna intervención manual.

```sql
CREATE DATABASE IF NOT EXISTS cv_db;
USE cv_db;

CREATE TABLE persona (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  ciudad   VARCHAR(100) NOT NULL,
  foto     VARCHAR(255)
);

CREATE TABLE formacion (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  institucion VARCHAR(200) NOT NULL,
  anio        VARCHAR(10)  NOT NULL,
  persona_id  INT,
  FOREIGN KEY (persona_id) REFERENCES persona(id)
);

INSERT INTO persona (nombre, apellido, ciudad, foto) VALUES
('Freddy', 'Chumacero', 'Lima', 'https://via.placeholder.com/150/4f46e5/ffffff?text=FC');

INSERT INTO formacion (titulo, institucion, anio, persona_id) VALUES
('Diplomado Full Stack Developer Back End Front End', 'USIP', '2026', 1),
('Ingeniería de Sistemas / Computación', 'Universidad Nacional', '2020', 1),
('Certificación Docker y DevOps', 'Udemy', '2024', 1),
('Certificación Node.js Application Developer', 'OpenJS Foundation', '2023', 1);
```

### Tablas implementadas

**Tabla `persona`:**

| Campo | Tipo |
|---|---|
| id | INT AUTO_INCREMENT PRIMARY KEY |
| nombre | VARCHAR(100) |
| apellido | VARCHAR(100) |
| ciudad | VARCHAR(100) |
| foto | VARCHAR(255) |

**Tabla `formacion`:**

| Campo | Tipo |
|---|---|
| id | INT AUTO_INCREMENT PRIMARY KEY |
| titulo | VARCHAR(200) |
| institucion | VARCHAR(200) |
| anio | VARCHAR(10) |
| persona_id | INT (FK → persona.id) |

---

## 6. Backend — Node.js

**Archivo:** `backend/index.js`  
**Puerto:** 4000  
**Imagen:** `node:20-alpine`

### Endpoint implementado

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/cv` | Retorna datos personales y formación académica en JSON |

### Respuesta del endpoint `GET /cv`

```json
{
  "persona": {
    "id": 1,
    "nombre": "Freddy",
    "apellido": "Chumacero",
    "ciudad": "Lima",
    "foto": "https://via.placeholder.com/150/4f46e5/ffffff?text=FC"
  },
  "formacion": [
    {
      "id": 1,
      "titulo": "Diplomado Full Stack Developer Back End Front End",
      "institucion": "USIP",
      "anio": "2026",
      "persona_id": 1
    }
  ]
}
```

### Dockerfile — Backend

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY index.js .
EXPOSE 4000
CMD ["node", "index.js"]
```

---

## 7. Frontend — React + Nginx

**Puerto:** 3000 (mapeado al puerto 80 del contenedor Nginx)  
**Imágenes:** `node:20-alpine` (build) + `nginx:1.27-alpine` (servicio)

El Dockerfile del frontend utiliza **multi-stage build**:
- **Etapa 1:** Compila la aplicación React con `node:20-alpine`
- **Etapa 2:** Sirve el resultado con `nginx:1.27-alpine`

### Dockerfile — Frontend

```dockerfile
# Etapa 1: Build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY public/ ./public/
COPY src/    ./src/
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 8. Docker Compose

**Archivo:** `docker-compose.yml`

```yaml
version: '3.9'

services:

  database:
    image: mysql:8.0
    container_name: cv_database
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: cv_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - cv_network

  backend:
    image: freddychumacero/chumacero-backend:v1
    container_name: cv_backend
    environment:
      DB_HOST: database
      DB_USER: root
      DB_PASSWORD: root123
      DB_NAME: cv_db
    ports:
      - "4000:4000"
    depends_on:
      - database
    restart: always
    networks:
      - cv_network

  frontend:
    image: freddychumacero/chumacero-frontend:v1
    container_name: cv_frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - cv_network

volumes:
  mysql_data:

networks:
  cv_network:
```

### Características del Docker Compose

| Requisito | Implementado |
|---|---|
| Descarga imágenes desde Docker Hub | ✅ `freddychumacero/chumacero-backend:v1` y `chumacero-frontend:v1` |
| 3 servicios: frontend, backend, database | ✅ |
| Una sola red Docker | ✅ `cv_network` |
| `depends_on` configurado | ✅ backend → database, frontend → backend |
| Volumen para MySQL | ✅ `mysql_data` |
| Versiones específicas de imágenes | ✅ `mysql:8.0`, `node:20-alpine`, `nginx:1.27-alpine` |
| Inicio con un solo comando | ✅ `docker compose up -d` |
| `restart: always` en backend | ✅ |

---

## 9. Flujo de Ejecución

Al ejecutar `docker compose up -d` la solución funciona en el siguiente orden:

```
[1]  Docker Compose descarga las imágenes desde Docker Hub
[2]  Inicia el contenedor MySQL (database)
[3]  MySQL crea automáticamente la base de datos cv_db
[4]  MySQL ejecuta init.sql desde /docker-entrypoint-initdb.d/
[5]  init.sql crea las tablas: persona y formacion
[6]  init.sql inserta los datos de Freddy Chumacero
[7]  Inicia el contenedor backend (Node.js)
[8]  Backend se conecta correctamente a MySQL
[9]  Backend expone el endpoint GET /cv en puerto 4000
[10] Inicia el contenedor frontend (React + Nginx)
[11] Frontend consume la información desde http://backend:4000/cv
[12] Navegador muestra el CV en http://localhost:3000
```

---

## 10. Instrucciones de Ejecución

### Requisitos previos
- Docker Desktop instalado y en ejecución
- Conexión a internet (para descargar imágenes de Docker Hub)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/freddychumacero/cv-chumacero.git

# 2. Entrar a la carpeta
cd cv-chumacero

# 3. Iniciar la aplicación completa
docker compose up -d

# 4. Verificar que los 3 contenedores estén corriendo
docker compose ps

# 5. Abrir en el navegador
# http://localhost:3000
```

### Comando de inicio

```
docker compose up -d
```

---

## 11. Resultado Esperado

Al ingresar a `http://localhost:3000` se visualiza:

- ✅ Fotografía del estudiante
- ✅ Nombre: Freddy
- ✅ Apellido: Chumacero
- ✅ Ciudad: Lima
- ✅ Formación académica (listado desde MySQL)

Toda la información proviene desde la base de datos MySQL mediante el backend Node.js.

---

## 12. Criterios de Calificación

| Criterio | % | Evidencia |
|---|---|---|
| **Funcionamiento integral** | 25% | La aplicación inicia correctamente con `docker compose up -d` y muestra la información desde MySQL en http://localhost:3000 |
| **Documento de entrega y evidencias** | 25% | Presente informe con URL de descarga, nombres de imágenes publicadas e instrucciones de ejecución |
| **Base de Datos** | 25% | Script `database/init.sql` montado en `/docker-entrypoint-initdb.d/` ejecutado automáticamente al iniciar el contenedor |
| **Docker Compose** | 25% | `docker-compose.yml` con red `cv_network`, volumen `mysql_data`, `depends_on`, `restart: always` y versiones específicas |

---

*Freddy Einard Chumacero Cors — Diplomado Full Stack Developer Back End Front End — USIP 2026*
