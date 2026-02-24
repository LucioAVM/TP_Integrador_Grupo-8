import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import Admin from './BackEnd/src/Models/admin.js';
import Impresora from './BackEnd/src/Models/impresora.js';
import Venta from './BackEnd/src/Models/venta.js';
import VentaProducto from './BackEnd/src/Models/venta_productos.js';
import path from 'path';
import fs from 'fs';
import sequelize from './BackEnd/src/config/db.js';
import { fileURLToPath } from 'url';
import VistaProductos from './BackEnd/src/Models/vista_productos.js';
import { Op } from 'sequelize';
import adminRouter from './BackEnd/src/Routes/admin/admin.routes.js';
import ventasRouter from './BackEnd/src/Routes/ventas.routes.js';
import encuestaRouter from './BackEnd/src/Routes/encuesta.routes.js';

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

// Relacionar modelos de ventas
Venta.hasMany(VentaProducto, { foreignKey: 'venta_id' });
VentaProducto.belongsTo(Venta, { foreignKey: 'venta_id' });

// Montar router admin (login, dashboard, CRUD productos)
app.use('/', adminRouter);

// Montar router ventas (MVC)
app.use('/', ventasRouter);

// Montar router encuesta (clientes)
app.use('/', encuestaRouter);

// Endpoint para obtener productos desde la base de datos (API REST)
app.get('/api/productos', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const offset = (page - 1) * limit;
    const q = req.query.q || null;
    const categoria = req.query.categoria || null;
    const tipo = req.query.tipo || null; // Keep this line for context

    const where = {};
    if (q) {
      if (!isNaN(Number(q))) {
        where.id = Number(q);
        } else {
          where.nombre = { [Op.like]: `%${q}%` };
        }
    }
    if (categoria) where.categoria = categoria;
      if (tipo) {
        where[Op.or] = [{ tipo_producto: tipo }, { tipo: tipo }];
      }

    const { count, rows } = await VistaProductos.findAndCountAll({ where, limit, offset, order: [['id', 'ASC']] });
    const totalPages = Math.max(Math.ceil(count / limit), 1);

    res.json({ products: rows, totalPages, page });
  } catch (err) {
    console.error('Error al consultar productos:', err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// Endpoint para obtener filtros universales (categorías y tipos)
app.get('/api/productos/filters', async (req, res) => {
  try {
    const categoriasRows = await VistaProductos.findAll({ attributes: ['categoria'], group: ['categoria'] });
    const tiposRowsA = await VistaProductos.findAll({ attributes: ['tipo_producto'], group: ['tipo_producto'] });
    const tiposRowsB = await VistaProductos.findAll({ attributes: ['tipo'], group: ['tipo'] });
    // Normalizar a minúsculas y eliminar nulos/vacíos
    const categorias = Array.from(new Set(categoriasRows.map(r => (r.categoria || '').toString().toLowerCase()).filter(Boolean)));
    const tiposA = tiposRowsA.map(r => (r.tipo_producto || '').toString().toLowerCase()).filter(Boolean);
    const tiposB = tiposRowsB.map(r => (r.tipo || '').toString().toLowerCase()).filter(Boolean);
    const tipos = Array.from(new Set([...tiposA, ...tiposB]));
    res.json({ categorias, tipos });
  } catch (err) {
    console.error('Error al obtener filtros:', err);
    res.status(500).json({ error: 'Error al obtener filtros' });
  }
});

// Endpoint para guardar una venta
app.post('/api/ventas', async (req, res) => {
  try {
    const { nombre_usuario, productos, total } = req.body;

    // Validar que todos los productos existan en impresoras o insumos
    for (const p of productos) {
      const producto = await VistaProductos.findByPk(p.producto_id);
      if (!producto) {
        return res.status(400).json({ error: `Producto con ID ${p.producto_id} no encontrado.` });
      }
    }

    // Registrar la venta
    const venta = await Venta.create({ nombre_usuario, total });
    for (const p of productos) {
      await VentaProducto.create({
        venta_id: venta.id,
        producto_id: p.producto_id,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
      });
    }

    res.status(201).json({ mensaje: 'Venta registrada exitosamente.' });
  } catch (err) {
    console.error('Error al registrar la venta:', err);
    res.status(500).json({ error: 'Error al registrar la venta.' });
  }
});

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
  // Evitar que Sequelize intente crear/alterar la vista `vista_productos` que ya existe en la base
  if (VistaProductos && typeof VistaProductos.sync === 'function') {
    VistaProductos.sync = async () => Promise.resolve();
  }

  await sequelize.sync();
} catch (syncErr) {
  console.error('Error al sincronizar la base de datos:', syncErr);
}

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});