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

// Middleware para proteger rutas de admin
function requireAdmin(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect('/login');
  }
  next();
}

// Rutas de login administrador
app.get('/login', (req, res) => {
  res.render('login', { error: null, activePage: 'login' });
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
  const mensaje = req.query.mensaje || null;
  const error = req.query.error || null;
  res.render('dashboard', { admin, productos, mensaje, error, activePage: 'dashboard' });
});

// Rutas de productos
app.get('/productos', requireAdmin, async (req, res) => {
  try {
    const productos = await VistaProductos.findAll(); // Usamos VistaProductos
    res.render('productos/index', { productos, activePage: 'productos' });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('error', { mensaje: 'Error al cargar los productos', activePage: 'productos' });
  }
});

app.get('/productos/:id', requireAdmin, async (req, res) => {
  const producto = await VistaProductos.findByPk(req.params.id); // Cambiado para usar VistaProductos
  if (!producto) {
    return res.render('error', { mensaje: 'Producto no encontrado', activePage: 'productos' });
  }
  res.render('productos/detalle', { producto, activePage: 'productos' });
});

app.get('/productos/nuevo', requireAdmin, (req, res) => {
  res.render('productos/crear_producto', { activePage: 'productos' });
});

app.post('/productos/nuevo', requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, tipo } = req.body;
    if (!nombre || !precio || !tipo) {
      throw new Error('Nombre, precio y tipo son obligatorios.');
    }
    await VistaProductos.create({ nombre, descripcion, precio, categoria, tipo, activo: true }); // Cambiado para usar VistaProductos
    res.redirect('/dashboard?mensaje=Producto creado exitosamente');
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.redirect('/dashboard?error=Error al crear producto');
  }
});

app.get('/productos/:id/editar', requireAdmin, async (req, res) => {
  try {
    const producto = await Impresora.findByPk(req.params.id);
    if (!producto) {
      return res.render('error', { mensaje: 'Producto no encontrado', activePage: 'productos' });
    }
    const productoPlano = producto.get({ plain: true });
    console.log('Producto enviado a la vista:', productoPlano); // Depuración
    res.render('productos/editar_producto', { producto: productoPlano, activePage: 'productos' });
  } catch (err) {
    console.error('Error al cargar producto:', err);
    res.render('error', { mensaje: 'Error al cargar producto', activePage: 'productos' });
  }
});

app.post('/productos/:id/editar', requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, tipo } = req.body;
    if (!nombre || !precio || !tipo) {
      throw new Error('Nombre, precio y tipo son obligatorios.');
    }
    await Impresora.update(
      { nombre, descripcion, precio, categoria, tipo },
      { where: { id: req.params.id } }
    );
    res.redirect('/dashboard?mensaje=Producto actualizado exitosamente');
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.redirect('/dashboard?error=Error al editar producto');
  }
});

app.post('/productos/:id/desactivar', requireAdmin, async (req, res) => {
  try {
    await Impresora.update({ activo: false }, { where: { id: req.params.id } });
    res.redirect('/dashboard?mensaje=Producto desactivado exitosamente');
  } catch (err) {
    console.error('Error al desactivar producto:', err);
    res.redirect('/dashboard?error=Error al desactivar producto');
  }
});

app.post('/productos/:id/reactivar', requireAdmin, async (req, res) => {
  try {
    await Impresora.update({ activo: true }, { where: { id: req.params.id } });
    res.redirect('/dashboard?mensaje=Producto reactivado exitosamente');
  } catch (err) {
    console.error('Error al reactivar producto:', err);
    res.redirect('/dashboard?error=Error al reactivar producto');
  }
});
// Rutas de ventas
app.get('/ventas', requireAdmin, async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: VentaProducto,
        attributes: ['producto_id', 'cantidad', 'precio_unitario'],
      },
    });
    console.log('Ventas encontradas:', ventas);
    console.log('Intentando renderizar vista: ventas/index.ventas');
    res.render('ventas/index_ventas', { ventas, activePage: 'ventas' });
  } catch (error) {
    console.error('Error al cargar las ventas:', error.message);
    res.render('error', { mensaje: 'Error al cargar las ventas', activePage: 'ventas' });
  }
});

app.get('/ventas/:id', requireAdmin, async (req, res) => {
  const venta = await Venta.findByPk(req.params.id, { include: VentaProducto });
  if (!venta) {
    return res.render('error', { mensaje: 'Venta no encontrada', activePage: 'ventas' });
  }
  res.render('ventas/detalle_ventas', { venta, activePage: 'ventas' });
});

app.post('/ventas/nueva', requireAdmin, async (req, res) => {
  const { nombre_usuario, productos, total } = req.body;
  const venta = await Venta.create({ nombre_usuario, total });
  for (const p of productos) {
    await VentaProducto.create({
      venta_id: venta.id,
      producto_id: p.producto_id,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario,
    });
  }
  res.redirect('/ventas');
});

// Endpoint para obtener productos desde la base de datos (API REST)
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await VistaProductos.findAll();
    console.log('Productos devueltos por la API:', productos); // Depuración
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