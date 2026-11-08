-- Base de datos: transporte_prog4
-- Gestión de vehículos, conductores y viajes

CREATE DATABASE IF NOT EXISTS transporte_prog4
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE transporte_prog4;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS `vehiculos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `marca` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patente` VARCHAR(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anio` YEAR NOT NULL,
  `capacidad_carga` DECIMAL(10,2) NOT NULL COMMENT 'en kg',
  `creado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patente` (`patente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de conductores
CREATE TABLE IF NOT EXISTS `conductores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nro_documento` VARCHAR(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nro_licencia` VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_alta_licencia` DATE NOT NULL,
  `fecha_vencimiento_licencia` DATE NOT NULL,
  `creado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nro_documento` (`nro_documento`),
  UNIQUE KEY `nro_licencia` (`nro_licencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de viajes
CREATE TABLE IF NOT EXISTS `viajes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vehiculo_id` INT NOT NULL,
  `conductor_id` INT NOT NULL,
  `fecha_salida` DATETIME NOT NULL,
  `fecha_llegada` DATETIME DEFAULT NULL,
  `origen` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destino` VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kilometros` DECIMAL(10,2) NOT NULL,
  `observaciones` TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_viaje_vehiculo` (`vehiculo_id`),
  KEY `idx_viaje_conductor` (`conductor_id`),
  KEY `idx_viaje_fecha` (`fecha_salida`),
  CONSTRAINT `fk_viaje_vehiculo` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_viaje_conductor` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
