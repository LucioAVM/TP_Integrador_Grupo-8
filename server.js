import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import Admin from './BackEnd/src/Models/admin.js';
import Producto from './BackEnd/src/Models/producto.js';
import Venta from './BackEnd/src/Models/venta.js';
import VentaProducto from './BackEnd/src/Models/venta_productos.js';
import path from 'path';
import fs from 'fs';
import sequelize from './BackEnd/src/config/db.js';
import { fileURLToPath } from 'url';
import adminRouter from './BackEnd/src/Routes/admin/admin.routes.js';
import ventasRouter from './BackEnd/src/Routes/ventas.routes.js';
import encuestaRouter from './BackEnd/src/Routes/encuesta.routes.js';
import productosApiRouter from './BackEnd/src/Routes/api/productos.routes.js';
import ventasApiRouter from './BackEnd/src/Routes/api/ventas.routes.js';
import usuariosApiRouter from './BackEnd/src/Routes/api/usuarios.routes.js';
import adminProductosApi from './BackEnd/src/Routes/admin/productos.api.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración para rutas absolutas con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura EJS como motor de vistas y la carpeta de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'BackEnd', 'src', 'views'));

// Middleware para parsear formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de express-session
app.use(session({
  secret: 'un_secreto_seguro_no_segurisimo',
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos del frontend
const staticPath = path.join(__dirname, 'FrontEnd', 'Public');
// Verificar existencia de la carpeta de uploads/productos
const productosUploadsDir = path.join(staticPath, 'uploads', 'productos');
console.log('Static dir:', staticPath);
console.log('Exists FrontEnd/Public/uploads/productos?', fs.existsSync(productosUploadsDir));
// Servir todos los assets desde la carpeta Public (incluye /uploads)
app.use(express.static(staticPath));

// Asociaciones de ventas y productos sobre la tabla pivote real
Venta.hasMany(VentaProducto, { foreignKey: 'venta_id', as: 'ventaProductos' });
Producto.hasMany(VentaProducto, { foreignKey: 'producto_id', as: 'ventaProductos' });
VentaProducto.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
VentaProducto.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

Venta.belongsToMany(Producto, {
  through: VentaProducto,
  foreignKey: 'venta_id',
  otherKey: 'producto_id',
  as: 'productos',
});
Producto.belongsToMany(Venta, {
  through: VentaProducto,
  foreignKey: 'producto_id',
  otherKey: 'venta_id',
  as: 'ventas',
});

// Montar router admin (login, dashboard, CRUD productos)
app.use('/', adminRouter);

// Montar router ventas (MVC)
app.use('/', ventasRouter);

// Montar router encuesta (clientes)
app.use('/', encuestaRouter);
// Montar API administrativo para productos antes del router público
app.use('/api/productos', adminProductosApi);
// Montar API público para productos (mantiene /api/productos y /api/productos/filters)
app.use('/api/productos', productosApiRouter);

// Montar API público para ventas (GET y POST /api/ventas)
app.use('/api/ventas', ventasApiRouter);

// Montar API para creación de administradores
app.use('/api/usuarios', usuariosApiRouter);

// Middleware para capturar errores de multer y otros errores de subida
app.use((err, req, res, next) => {
  if (!err) return next();
  // Errores de multer suelen tener code 'LIMIT_FILE_SIZE' o message descriptivo
  if (err.code === 'LIMIT_FILE_SIZE' || (err.message && err.message.includes('Tipo de archivo'))) {
    console.error('Error de subida de archivo:', err);
    return res.redirect('/dashboard?error=' + encodeURIComponent(err.message || 'Error al subir archivo'));
  }
  next(err);
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  try {
    res.status(500).render('error', { mensaje: 'Error interno del servidor', activePage: null });
  } catch (renderErr) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// Iniciar el servidor
// Sincronizar modelos con la base de datos (crea las tablas que falten) y luego iniciar
try {
  if (process.env.SKIP_DB_SYNC === 'true') {
    console.log('SKIP_DB_SYNC=true -> omitido sequelize.sync() (arranque rápido sin DB)');
  } else {
    await sequelize.sync({ alter: false });
  }
} catch (syncErr) {
  console.error('Error al sincronizar la base de datos:', syncErr);
}

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});