import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import Admin from './BackEnd/src/Models/admin.js';
import Impresora from './BackEnd/src/Models/impresora.js';
import Venta from './BackEnd/src/Models/venta.js';
import VentaProducto from './BackEnd/src/Models/venta_productos.js';
import path from 'path';
import { fileURLToPath } from 'url';
import VistaProductos from './BackEnd/src/Models/vista_productos.js';
import { crearProductoMiddleware } from './BackEnd/src/middlewares/crearProductoMiddleware.js';
import adminRouter from './BackEnd/src/Routes/admin/admin.routes.js';
import ventasRouter from './BackEnd/src/Routes/ventas.routes.js';

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
app.use(express.static(path.join(__dirname, 'FrontEnd', 'Public')));

// Relacionar modelos de ventas
Venta.hasMany(VentaProducto, { foreignKey: 'venta_id' });
VentaProducto.belongsTo(Venta, { foreignKey: 'venta_id' });

// Montar router admin (login, dashboard, CRUD productos)
app.use('/', adminRouter);

// Montar router ventas (MVC)
app.use('/', ventasRouter);

// Endpoint para obtener productos desde la base de datos (API REST)
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await VistaProductos.findAll();
    res.json(productos);
  } catch (err) {
    console.error('Error al consultar productos:', err);
    res.status(500).json({ error: 'Error al consultar productos' });
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});