import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import Impresora from './BackEnd/src/Models/impresora.js';
import Admin from './BackEnd/src/Models/admin.js';
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

// Archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'FrontEnd', 'Public')));

// Endpoint para obtener productos desde la base de datos
app.get('/api/productos', async (req, res) => {
  console.log('Handler /api/productos ejecutado');
  try {
    console.log('Consultando productos...');
    const productos = await Impresora.findAll({ where: { activo: true } });
    console.log('Productos obtenidos:', productos);
    res.json(productos);
  } catch (err) {
    console.error('Error al consultar productos:', err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

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
  // Aquí deberías guardar la sesión, pero por ahora redirige al dashboard
  res.redirect('/dashboard');
});

// Dashboard del administrador
app.get('/dashboard', (req, res) => {
  res.send('<h1>Bienvenido al Dashboard de Administrador</h1>');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});