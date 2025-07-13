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
  secret: 'un_secreto_seguro', // Cambia esto por un secreto fuerte en producción
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'FrontEnd', 'Public')));

// Relacionar modelos de ventas
Venta.hasMany(VentaProducto, { foreignKey: 'venta_id' });
VentaProducto.belongsTo(Venta, { foreignKey: 'venta_id' });

// Middleware para proteger rutas de admin
function requireAdmin(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect('/login');
  }
  next();
}

// Rutas de login administrador
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return res.render('login', { error: 'Usuario o contraseña incorrectos' });
  }
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.render('login', { error: 'Usuario o contraseña incorrectos' });
  }
  // Guardar sesión
  req.session.adminId = admin.id;
  res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Dashboard del administrador (protegido)
app.get('/dashboard', requireAdmin, async (req, res) => {
  const admin = await Admin.findByPk(req.session.adminId);
  const productos = await Impresora.findAll();
  res.render('dashboard', { admin, productos });
});

// Formulario de alta de producto
app.get('/dashboard/productos/agregar', requireAdmin, (req, res) => {
  res.render('agregarProducto');
});

// Lógica de alta de producto
app.post('/dashboard/productos/agregar', requireAdmin, async (req, res) => {
  await Impresora.create(req.body);
  res.redirect('/dashboard');
});

// Formulario de edición de producto
app.get('/dashboard/productos/:id/editar', requireAdmin, async (req, res) => {
  const producto = await Impresora.findByPk(req.params.id);
  res.render('editarProducto', { product: producto });
});

// Lógica de edición de producto
app.post('/dashboard/productos/:id/editar', requireAdmin, async (req, res) => {
  await Impresora.update(req.body, { where: { id: req.params.id } });
  res.redirect('/dashboard');
});

// Baja lógica (desactivar)
app.post('/dashboard/productos/:id/desactivar', requireAdmin, async (req, res) => {
  await Impresora.update({ activo: false }, { where: { id: req.params.id } });
  res.redirect('/dashboard');
});

// Reactivar producto
app.post('/dashboard/productos/:id/reactivar', requireAdmin, async (req, res) => {
  await Impresora.update({ activo: true }, { where: { id: req.params.id } });
  res.redirect('/dashboard');
});

// Endpoint para obtener productos desde la base de datos (API REST)
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Impresora.findAll({ where: { activo: true } });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// Endpoint para guardar una venta
app.post('/api/ventas', async (req, res) => {
  try {
    const { nombre_usuario, productos, total } = req.body;
    // productos: [{ producto_id, cantidad, precio_unitario }]
    const venta = await Venta.create({ nombre_usuario, total });
    for (const p of productos) {
      await VentaProducto.create({
        venta_id: venta.id,
        producto_id: p.producto_id,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario
      });
    }
    res.status(201).json({ mensaje: 'Venta registrada', venta_id: venta.id });
  } catch (err) {
  console.error('Error al registrar la venta:', err);
  res.status(500).json({ error: 'Error al registrar la venta' });
}
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});