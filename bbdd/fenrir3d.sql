
-- Crear base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'fenrir_3d')
    CREATE DATABASE fenrir_3d;
GO
USE fenrir_3d;
GO

-- Tabla: impresoras
CREATE TABLE impresoras (
    id INT PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX),
    precio DECIMAL(10,2),
    imagen NVARCHAR(255),
    categoria NVARCHAR(50),
    tipo NVARCHAR(10) CHECK (tipo IN ('filamento', 'resina')),
    activo BIT
);

-- Tabla: insumos
CREATE TABLE insumos (
    id INT PRIMARY KEY,
    nombre NVARCHAR(100),
    tipo NVARCHAR(10) CHECK (tipo IN ('filamento', 'resina')),
    descripcion NVARCHAR(MAX),
    precio DECIMAL(10,2),
    imagen NVARCHAR(255),
    activo BIT
);

-- Insertar datos en impresoras
INSERT INTO impresoras (id, nombre, descripcion, precio, imagen, categoria, tipo, activo) VALUES
(1, N'Impresora 3D Creality Ender 3', N'Impresora 3D de alta precisión, ideal para principiantes.', 250000, N'/assets/img/ender3.jpg', N'impresoras', N'filamento', 1),
(2, N'Impresora 3D Anycubic Photon Mono', N'Impresora 3D de resina, excelente para detalles finos.', 320000, N'/assets/img/photonmono.jpg', N'impresoras', N'resina', 1),
(3, N'Impresora 3D Bambu Lab A1', N'Impresora compacta y veloz, ideal para uso general y doméstico.', 450000, N'/assets/img/bambulab_a1.jpg', N'impresoras', N'filamento', 1),
(4, N'Impresora 3D Creality Ender-3 V3 SE', N'Versión mejorada de la Ender 3, fácil de usar y económica.', 270000, N'/assets/img/ender3v3se.jpg', N'impresoras', N'filamento', 1),
(5, N'Impresora 3D Anycubic Kobra 3 Combo', N'Impresora multifilamento rápida y versátil, ideal para principiantes.', 390000, N'/assets/img/kobra3combo.jpg', N'impresoras', N'filamento', 1),
(6, N'Impresora 3D Original Prusa MK4S', N'Modelo profesional con gran precisión y fiabilidad para prototipado.', 780000, N'/assets/img/prusa_mk4s.jpg', N'impresoras', N'filamento', 1),
(7, N'Impresora 3D Elegoo Neptune 4 Max', N'Impresora FDM de gran formato, ideal para piezas grandes.', 520000, N'/assets/img/neptune4max.jpg', N'impresoras', N'filamento', 1),
(8, N'Impresora 3D Anycubic Photon M3 Max', N'Impresora de resina de gran volumen, perfecta para modelos detallados.', 680000, N'/assets/img/photonm3max.jpg', N'impresoras', N'resina', 1);

-- Insertar datos en insumos
INSERT INTO insumos (id, nombre, tipo, descripcion, precio, imagen, activo) VALUES
(1, N'PLA Premium Blanco 1.75mm', N'filamento', N'Filamento PLA de alta calidad, ideal para prototipos y piezas decorativas.', 8500, N'/assets/img/pla_blanco.jpg', 1),
(2, N'PETG Negro 1.75mm', N'filamento', N'Filamento PETG resistente y flexible, ideal para piezas funcionales.', 9800, N'/assets/img/petg_negro.jpg', 1),
(3, N'ABS Rojo 1.75mm', N'filamento', N'Filamento ABS resistente al calor, ideal para uso industrial.', 10500, N'/assets/img/abs_rojo.jpg', 1),
(4, N'Resina UV Standard Gris', N'resina', N'Resina UV estándar, buena precisión y acabado superficial.', 12000, N'/assets/img/resina_gris.jpg', 1),
(5, N'Resina Lavable Azul', N'resina', N'Resina lavable con agua, segura y fácil de limpiar.', 13500, N'/assets/img/resina_azul.jpg', 1),
(6, N'Resina Flexible Transparente', N'resina', N'Resina con propiedades elásticas, ideal para piezas flexibles.', 15500, N'/assets/img/resina_flexible.jpg', 1);
