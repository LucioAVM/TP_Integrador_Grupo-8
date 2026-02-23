import bcrypt from 'bcryptjs';
import Admin from '../Models/admin.js';
import VistaProductos from '../Models/vista_productos.js';
import Impresora from '../Models/impresora.js';
import Insumo from '../Models/insumo.js';
import { crearProductoMiddleware } from '../middlewares/crearProductoMiddleware.js';

const getLogin = (req, res) => {
  res.render('login', { error: null, activePage: 'login' });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    req.session.adminId = admin.id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error en el login' });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

const getDashboard = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.session.adminId);
    const productos = await VistaProductos.findAll();
    const mensaje = req.query.mensaje || null;
    const error = req.query.error || null;
    res.render('dashboard', { admin, productos, mensaje, error, activePage: 'dashboard' });
  } catch (error) {
    console.error('Error al cargar el dashboard:', error);
    res.render('error', { mensaje: 'Error al cargar el dashboard', activePage: 'dashboard' });
  }
};

const getProductos = async (req, res) => {
  try {
    const productos = await VistaProductos.findAll();
    res.render('productos/index', { productos, activePage: 'productos' });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('error', { mensaje: 'Error al cargar los productos', activePage: 'productos' });
  }
};

const getProductoDetalle = async (req, res) => {
  try {
    const producto = await VistaProductos.findByPk(req.params.id);
    if (!producto) return res.render('error', { mensaje: 'Producto no encontrado', activePage: 'productos' });
    res.render('productos/detalle', { producto, activePage: 'productos' });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar detalle', activePage: 'productos' });
  }
};

const getCrearProducto = (req, res) => {
  res.render('crearProducto');
};

const postCrearProducto = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      crearProductoMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });
    res.redirect('/dashboard?mensaje=Producto creado exitosamente');
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.redirect('/dashboard?error=Error al crear producto');
  }
};

const getEditarProducto = async (req, res) => {
  try {
    const productoId = req.params.id;
    const producto = await VistaProductos.findByPk(productoId);
    if (!producto) return res.render('error', { mensaje: 'Producto no encontrado', activePage: 'productos' });
    res.render('productos/editar_producto', { producto, activePage: 'productos' });
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    res.render('error', { mensaje: 'Error al cargar el formulario de edición', activePage: 'productos' });
  }
};

const postEditarProducto = async (req, res) => {
  try {
    const productoId = req.params.id;
    const { nombre, descripcion, precio, categoria, tipo, activo } = req.body;
    const producto = await VistaProductos.findByPk(productoId);
    if (!producto) return res.redirect('/dashboard?error=Producto no encontrado');

    if (producto.tipo_producto === 'impresora') {
      await Impresora.update(
        { nombre, descripcion, precio, categoria, tipo, activo: activo === 'true' },
        { where: { id: productoId } }
      );
    } else if (producto.tipo_producto === 'insumo') {
      await Insumo.update(
        { nombre, descripcion, precio, categoria, tipo, activo: activo === 'true' },
        { where: { id: productoId } }
      );
    }

    res.redirect('/dashboard?mensaje=Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.redirect('/dashboard?error=Error al actualizar el producto');
  }
};

const postDesactivar = async (req, res) => {
  try {
    const productoId = req.params.id;
    const producto = await VistaProductos.findByPk(productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    if (producto.tipo_producto === 'impresora') {
      await Impresora.update({ activo: false }, { where: { id: productoId } });
    } else if (producto.tipo_producto === 'insumo') {
      await Insumo.update({ activo: false }, { where: { id: productoId } });
    }

    producto.activo = false;
    res.json(producto);
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    res.status(500).json({ error: 'Error al desactivar producto' });
  }
};

const postReactivar = async (req, res) => {
  try {
    const productoId = req.params.id;
    const producto = await VistaProductos.findByPk(productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    if (producto.tipo_producto === 'impresora') {
      await Impresora.update({ activo: true }, { where: { id: productoId } });
    } else if (producto.tipo_producto === 'insumo') {
      await Insumo.update({ activo: true }, { where: { id: productoId } });
    }

    producto.activo = true;
    res.json(producto);
  } catch (error) {
    console.error('Error al reactivar producto:', error);
    res.status(500).json({ error: 'Error al reactivar producto' });
  }
};

export default {
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getProductos,
  getProductoDetalle,
  getCrearProducto,
  postCrearProducto,
  getEditarProducto,
  postEditarProducto,
  postDesactivar,
  postReactivar,
};
