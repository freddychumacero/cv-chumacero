-- ============================================================
-- CV Personal - Freddy Einard Chumacero Cors
-- Diplomado Full Stack Developer - USIP 2026
-- Script de inicialización automática de base de datos
-- ============================================================

CREATE DATABASE IF NOT EXISTS cv_db;
USE cv_db;

-- Tabla: persona
CREATE TABLE persona (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  ciudad   VARCHAR(100) NOT NULL,
  foto     VARCHAR(255)
);

-- Tabla: formacion
CREATE TABLE formacion (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  institucion VARCHAR(200) NOT NULL,
  anio        VARCHAR(10)  NOT NULL,
  persona_id  INT,
  FOREIGN KEY (persona_id) REFERENCES persona(id)
);

-- Datos personales
INSERT INTO persona (nombre, apellido, ciudad, foto) VALUES
('Freddy', 'Chumacero', 'Lima', 'https://via.placeholder.com/150/4f46e5/ffffff?text=FC');

-- Formación académica
INSERT INTO formacion (titulo, institucion, anio, persona_id) VALUES
('Diplomado Full Stack Developer Back End Front End', 'USIP', '2026', 1),
('Ingeniería de Sistemas / Computación', 'Universidad Nacional', '2020', 1),
('Certificación Docker y DevOps', 'Udemy', '2024', 1),
('Certificación Node.js Application Developer', 'OpenJS Foundation', '2023', 1);
