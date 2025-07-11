import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from './Models/admin.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración para rutas absolutas con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura EJS como motor de vistas y la carpeta de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// GET /login
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login
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

// GET /dashboard (pantalla de bienvenida para el admin)
app.get('/dashboard', (req, res) => {
  res.send('<h1>Bienvenido al Dashboard de Administrador</h1>');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});