import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import Admin from './BackEnd/src/Models/admin.js';
import Impresora from './BackEnd/src/Models/impresora.js';
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});