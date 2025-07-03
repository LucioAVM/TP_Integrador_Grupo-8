
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS fenrir_3d;
USE fenrir_3d;

-- Tabla: impresoras
CREATE TABLE impresoras (
    id INT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen VARCHAR(255),
    categoria VARCHAR(50),
    tipo ENUM('filamento', 'resina'),
    activo BOOLEAN
);

-- Tabla: insumos
CREATE TABLE insumos (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    tipo ENUM('filamento', 'resina'),
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen VARCHAR(255),
    activo BOOLEAN
);

-- Insertar datos en impresoras
INSERT INTO impresoras (id, nombre, descripcion, precio, imagen, categoria, tipo, activo) VALUES
(1, 'Impresora 3D Creality Ender 3', 'Impresora 3D de alta precisión, ideal para principiantes.', 250000, '/assets/img/ender3.jpg', 'impresoras', 'filamento', TRUE),
(2, 'Impresora 3D Anycubic Photon Mono', 'Impresora 3D de resina, excelente para detalles finos.', 320000, '/assets/img/photonmono.jpg', 'impresoras', 'resina', TRUE),
(3, 'Impresora 3D Bambu Lab A1', 'Impresora compacta y veloz, ideal para uso general y doméstico.', 450000, '/assets/img/bambulab_a1.jpg', 'impresoras', 'filamento', TRUE),
(4, 'Impresora 3D Creality Ender-3 V3 SE', 'Versión mejorada de la Ender 3, fácil de usar y económica.', 270000, '/assets/img/ender3v3se.jpg', 'impresoras', 'filamento', TRUE),
(5, 'Impresora 3D Anycubic Kobra 3 Combo', 'Impresora multifilamento rápida y versátil, ideal para principiantes.', 390000, '/assets/img/kobra3combo.jpg', 'impresoras', 'filamento', TRUE),
(6, 'Impresora 3D Original Prusa MK4S', 'Modelo profesional con gran precisión y fiabilidad para prototipado.', 780000, '/assets/img/prusa_mk4s.jpg', 'impresoras', 'filamento', TRUE),
(7, 'Impresora 3D Elegoo Neptune 4 Max', 'Impresora FDM de gran formato, ideal para piezas grandes.', 520000, '/assets/img/neptune4max.jpg', 'impresoras', 'filamento', TRUE),
(8, 'Impresora 3D Anycubic Photon M3 Max', 'Impresora de resina de gran volumen, perfecta para modelos detallados.', 680000, '/assets/img/photonm3max.jpg', 'impresoras', 'resina', TRUE);

-- Insertar datos en insumos
INSERT INTO insumos (id, nombre, tipo, descripcion, precio, imagen, activo) VALUES
(1, 'PLA Premium Blanco 1.75mm', 'filamento', 'Filamento PLA de alta calidad, ideal para prototipos y piezas decorativas.', 8500, '/assets/img/pla_blanco.jpg', TRUE),
(2, 'PETG Negro 1.75mm', 'filamento', 'Filamento PETG resistente y flexible, ideal para piezas funcionales.', 9800, '/assets/img/petg_negro.jpg', TRUE),
(3, 'ABS Rojo 1.75mm', 'filamento', 'Filamento ABS resistente al calor, ideal para uso industrial.', 10500, '/assets/img/abs_rojo.jpg', TRUE),
(4, 'Resina UV Standard Gris', 'resina', 'Resina UV estándar, buena precisión y acabado superficial.', 12000, '/assets/img/resina_gris.jpg', TRUE),
(5, 'Resina Lavable Azul', 'resina', 'Resina lavable con agua, segura y fácil de limpiar.', 13500, '/assets/img/resina_azul.jpg', TRUE),
(6, 'Resina Flexible Transparente', 'resina', 'Resina con propiedades elásticas, ideal para piezas flexibles.', 15500, '/assets/img/resina_flexible.jpg', TRUE);
