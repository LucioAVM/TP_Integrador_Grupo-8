/*
  Fenrir 3D — datos históricos para /registros y /asistencia
  Ejecutar en SSMS o Azure Data Studio contra la misma BD del .env

  Qué hace:
  - Inserta ~15 ventas repartidas entre dic-2025 y may-2026 (columna fecha)
  - Carga venta_productos con productos reales (IDs 2–4 impresoras, 11–15 insumos)
  - Inserta encuestas post-compra vinculadas por email + comentario con ID de venta
  - Agrega logs de login del admin en distintas fechas

  Vínculo encuesta ↔ compra (no hay FK en BD):
  - email: nombrecliente@fenrir3d.demo
  - comentario: "Encuesta post-compra venta #<id>"
  - fecha encuesta: ~20 min después de la venta

  Opcional: descomentar el bloque DELETE si querés limpiar una corrida anterior.

  CÓMO EJECUTAR (elegí una):
  1) Desde la raíz del proyecto:  node scripts/run_seed_historicos.js
  2) En SSMS / Azure Data Studio: abrir este archivo y presionar Ejecutar (F5)
*/

-- BEGIN TRANSACTION  -- descomentar si querés poder hacer ROLLBACK

/* --- Limpieza opcional de corrida previa (mismos clientes demo) ---
DELETE FROM encuestas
WHERE email LIKE '%@fenrir3d.demo';

DELETE vp FROM venta_productos vp
INNER JOIN ventas v ON v.id = vp.venta_id
WHERE v.nombre_usuario IN (
  'Carlos','Valentina','Mateo','Sofía','Diego','Luciana',
  'Tomás','Camila','Bruno','Agustina','Nicolás','Florencia','Renata','Julián','Micaela'
);

DELETE FROM ventas
WHERE nombre_usuario IN (
  'Carlos','Valentina','Mateo','Sofía','Diego','Luciana',
  'Tomás','Camila','Bruno','Agustina','Nicolás','Florencia','Renata','Julián','Micaela'
);
--- fin limpieza --- */

-- ===== VENTAS (varios meses) =====
INSERT INTO ventas (nombre_usuario, fecha, total) VALUES
-- Diciembre 2025
('Carlos',    '2025-12-10 11:20:00',  35300.00),  -- 3 PLA + 1 PETG
('Valentina', '2025-12-22 16:45:00', 270000.00),  -- 1 Ender-3
-- Enero 2026
('Mateo',     '2026-01-08 09:15:00',  33000.00),  -- 2 ABS + 1 Resina gris
('Sofía',     '2026-01-18 14:00:00',  42500.00),  -- 5 PLA
('Diego',     '2026-01-25 19:30:00', 320000.00),  -- 1 Photon Mono
-- Febrero 2026
('Luciana',   '2026-02-05 10:10:00',  39200.00),  -- 4 PETG
('Tomás',     '2026-02-14 18:55:00', 450000.00),  -- 1 Bambu A1
('Camila',    '2026-02-28 12:40:00',  48000.00),  -- 2 Resina gris + 2 Resina azul
-- Marzo 2026
('Bruno',     '2026-03-07 08:50:00',  52500.00),  -- 3 ABS + 2 PLA
('Agustina',  '2026-03-15 17:25:00', 390000.00),  -- 1 Kobra 3 Combo (id 5)
('Nicolás',   '2026-03-22 21:10:00',  25500.00),  -- 3 PETG
('Florencia', '2026-03-29 13:35:00', 780000.00),  -- 1 Prusa MK4S
-- Abril 2026
('Renata',    '2026-04-11 11:05:00',  54000.00),  -- 4 Resina azul
('Julián',    '2026-04-20 15:50:00', 520000.00),  -- 1 Neptune 4 Max
-- Mayo 2026
('Micaela',   '2026-05-03 10:30:00',  31000.00),  -- 2 PLA + 1 PETG
('Carlos',    '2026-05-18 19:15:00', 135000.00);  -- 1 Resina flex + 5 PLA (cliente recurrente)

-- ===== DETALLE venta_productos =====
-- Carlos dic-2025
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 11, 3, 8500  FROM ventas v WHERE v.nombre_usuario = 'Carlos'    AND v.fecha = '2025-12-10 11:20:00';
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 12, 1, 9800  FROM ventas v WHERE v.nombre_usuario = 'Carlos'    AND v.fecha = '2025-12-10 11:20:00';

-- Valentina dic-2025
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 4, 1, 270000 FROM ventas v WHERE v.nombre_usuario = 'Valentina' AND v.fecha = '2025-12-22 16:45:00';

-- Mateo ene-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 13, 2, 10500 FROM ventas v WHERE v.nombre_usuario = 'Mateo'     AND v.fecha = '2026-01-08 09:15:00';
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 14, 1, 12000 FROM ventas v WHERE v.nombre_usuario = 'Mateo'     AND v.fecha = '2026-01-08 09:15:00';

-- Sofía ene-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 11, 5, 8500  FROM ventas v WHERE v.nombre_usuario = 'Sofía'     AND v.fecha = '2026-01-18 14:00:00';

-- Diego ene-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 2, 1, 320000 FROM ventas v WHERE v.nombre_usuario = 'Diego'     AND v.fecha = '2026-01-25 19:30:00';

-- Luciana feb-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 12, 4, 9800  FROM ventas v WHERE v.nombre_usuario = 'Luciana'   AND v.fecha = '2026-02-05 10:10:00';

-- Tomás feb-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 3, 1, 450000 FROM ventas v WHERE v.nombre_usuario = 'Tomás'     AND v.fecha = '2026-02-14 18:55:00';

-- Camila feb-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 14, 2, 12000 FROM ventas v WHERE v.nombre_usuario = 'Camila'    AND v.fecha = '2026-02-28 12:40:00';
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 15, 2, 13500 FROM ventas v WHERE v.nombre_usuario = 'Camila'    AND v.fecha = '2026-02-28 12:40:00';

-- Bruno mar-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 13, 3, 10500 FROM ventas v WHERE v.nombre_usuario = 'Bruno'     AND v.fecha = '2026-03-07 08:50:00';
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 11, 2, 8500  FROM ventas v WHERE v.nombre_usuario = 'Bruno'     AND v.fecha = '2026-03-07 08:50:00';

-- Agustina mar-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 5, 1, 390000 FROM ventas v WHERE v.nombre_usuario = 'Agustina'  AND v.fecha = '2026-03-15 17:25:00';

-- Nicolás mar-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 12, 3, 9800  FROM ventas v WHERE v.nombre_usuario = 'Nicolás'   AND v.fecha = '2026-03-22 21:10:00';

-- Florencia mar-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 6, 1, 780000 FROM ventas v WHERE v.nombre_usuario = 'Florencia' AND v.fecha = '2026-03-29 13:35:00';

-- Renata abr-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 15, 4, 13500 FROM ventas v WHERE v.nombre_usuario = 'Renata'    AND v.fecha = '2026-04-11 11:05:00';

-- Julián abr-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 7, 1, 520000 FROM ventas v WHERE v.nombre_usuario = 'Julián'    AND v.fecha = '2026-04-20 15:50:00';

-- Micaela may-2026
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 11, 2, 8500  FROM ventas v WHERE v.nombre_usuario = 'Micaela'   AND v.fecha = '2026-05-03 10:30:00';
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 12, 1, 9800  FROM ventas v WHERE v.nombre_usuario = 'Micaela'   AND v.fecha = '2026-05-03 10:30:00';

-- Carlos may-2026 (segunda compra)
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 16, 1, 15500 FROM ventas v WHERE v.nombre_usuario = 'Carlos'    AND v.fecha = '2026-05-18 19:15:00';
INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario)
SELECT v.id, 11, 5, 8500  FROM ventas v WHERE v.nombre_usuario = 'Carlos'    AND v.fecha = '2026-05-18 19:15:00';

-- ===== ENCUESTAS vinculadas a ventas =====
-- 12 encuestas (algunas ventas sin encuesta, como en la vida real)
-- imagen: reutiliza rutas que ya existen en la tabla encuestas (subida previa real)
INSERT INTO encuestas (puntuacion, comentario, imagen, fecha, email, terminos)
SELECT
  e.puntuacion,
  N'Encuesta post-compra venta #' + CAST(v.id AS VARCHAR(10)) + N' — ' + v.nombre_usuario,
  img.ruta,
  DATEADD(MINUTE, 20, v.fecha),
  LOWER(REPLACE(REPLACE(v.nombre_usuario, N'í', N'i'), N'á', N'a')) + N'@fenrir3d.demo',
  1
FROM ventas v
INNER JOIN (VALUES
  ('Carlos',    '2025-12-10 11:20:00', 5),
  ('Valentina', '2025-12-22 16:45:00', 4),
  ('Mateo',     '2026-01-08 09:15:00', 3),
  ('Sofía',     '2026-01-18 14:00:00', 5),
  ('Diego',     '2026-01-25 19:30:00', 4),
  ('Luciana',   '2026-02-05 10:10:00', 2),
  ('Tomás',     '2026-02-14 18:55:00', 5),
  ('Bruno',     '2026-03-07 08:50:00', 4),
  ('Agustina',  '2026-03-15 17:25:00', 5),
  ('Florencia', '2026-03-29 13:35:00', 3),
  ('Renata',    '2026-04-11 11:05:00', 4),
  ('Carlos',    '2026-05-18 19:15:00', 5)
) AS e(nombre_usuario, fecha, puntuacion)
  ON e.nombre_usuario = v.nombre_usuario AND e.fecha = v.fecha
OUTER APPLY (
  SELECT ei.imagen AS ruta
  FROM (
    SELECT imagen, MIN(id) AS primer_id
    FROM encuestas
    WHERE imagen IS NOT NULL AND LTRIM(RTRIM(imagen)) <> N''
    GROUP BY imagen
  ) ei
  ORDER BY ei.primer_id
  OFFSET (ABS(CHECKSUM(v.id, v.fecha)) % (
    SELECT COUNT(DISTINCT imagen)
    FROM encuestas
    WHERE imagen IS NOT NULL AND LTRIM(RTRIM(imagen)) <> N''
  )) ROWS
  FETCH NEXT 1 ROW ONLY
) img;

-- Si ya corriste una versión anterior sin imagen, esto las completa:
UPDATE e
SET e.imagen = img.ruta
FROM encuestas e
OUTER APPLY (
  SELECT ei.imagen AS ruta
  FROM (
    SELECT imagen, MIN(id) AS primer_id
    FROM encuestas
    WHERE imagen IS NOT NULL AND LTRIM(RTRIM(imagen)) <> N''
    GROUP BY imagen
  ) ei
  ORDER BY ei.primer_id
  OFFSET (ABS(CHECKSUM(e.id, e.fecha)) % (
    SELECT COUNT(DISTINCT imagen)
    FROM encuestas
    WHERE imagen IS NOT NULL AND LTRIM(RTRIM(imagen)) <> N''
  )) ROWS
  FETCH NEXT 1 ROW ONLY
) img
WHERE e.email LIKE N'%@fenrir3d.demo'
  AND (e.imagen IS NULL OR LTRIM(RTRIM(e.imagen)) = N'');

-- ===== LOGS admin (varios meses) =====
INSERT INTO logs (adminId, email, mensaje, createdAt)
SELECT 1, N'admin@admin.com', N'{"adminId":1,"email":"admin@admin.com","demo":"login-historico"}', fechas.dt
FROM (VALUES
  ('2025-12-01 09:00:00'),
  ('2026-01-10 10:30:00'),
  ('2026-02-14 08:15:00'),
  ('2026-03-20 16:45:00'),
  ('2026-04-25 11:20:00'),
  ('2026-05-10 18:00:00')
) AS fechas(dt);

-- ===== Verificación rápida =====
SELECT
  CONVERT(VARCHAR(7), fecha, 120) AS mes,
  COUNT(*) AS ventas,
  SUM(CAST(total AS DECIMAL(18,2))) AS recaudado
FROM ventas
GROUP BY CONVERT(VARCHAR(7), fecha, 120)
ORDER BY mes;

SELECT TOP 15
  e.id,
  e.fecha,
  e.email,
  e.puntuacion,
  e.comentario
FROM encuestas e
WHERE e.email LIKE N'%@fenrir3d.demo'
ORDER BY e.fecha;

-- COMMIT  -- descomentar si usaste BEGIN TRANSACTION
