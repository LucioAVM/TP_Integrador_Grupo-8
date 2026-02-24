import bcrypt from 'bcryptjs';
import Admin from '../Models/admin.js';
import VistaProductos from '../Models/vista_productos.js';
import { Op } from 'sequelize';
import Impresora from '../Models/impresora.js';
import Insumo from '../Models/insumo.js';
import Venta from '../Models/venta.js';
import VentaProducto from '../Models/venta_productos.js';
import Log from '../Models/log.js';
import ExcelJS from 'exceljs';
// La validación se aplica en la ruta mediante `validarProducto` y multer

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
    // Guardar registro de inicio de sesión usando modelo Sequelize Log
    try {
      await Log.create({ adminId: admin.id, email, mensaje: JSON.stringify({ adminId: admin.id, email }) });
    } catch (logErr) {
      console.error('Error al guardar log de inicio de sesión:', logErr);
    }
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
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const offset = (page - 1) * limit;
    const q = req.query.q || null;
    const categoria = req.query.categoria || null;

    const where = {};
    if (q) {
      if (!isNaN(Number(q))) {
        where.id = Number(q);
      } else {
        where.nombre = { [Op.like]: `%${q}%` };
      }
    }
    if (categoria) {
      where.categoria = categoria;
    }

    const { count, rows } = await VistaProductos.findAndCountAll({ where, limit, offset, order: [['id', 'ASC']] });

    const totalPages = Math.max(Math.ceil(count / limit), 1);

    res.render('productos/index', {
      products: rows,
      page,
      limit,
      totalPages,
      q,
      activePage: 'productos'
    });
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
    const { tipoProducto, nombre, precio, descripcion, activo, tipoImpresora, tipoInsumo } = req.body;
    const imagenPath = req.file ? `/uploads/productos/${req.file.filename}` : null;

    if (tipoProducto === 'impresoras') {
      // Regla: Impresoras -> IDs comienzan en 1 y son incrementales
      const maxId = await Impresora.max('id');
      const newId = (maxId === null || maxId === undefined) ? 1 : Number(maxId) + 1;
      await Impresora.create({
        id: newId,
        nombre,
        descripcion,
        precio,
        categoria: 'impresoras',
        tipo: tipoImpresora || null,
        activo: activo === 'true',
        imagen: imagenPath,
      });
    } else if (tipoProducto === 'insumos') {
      // Regla: Insumos -> IDs comienzan en 1000 y son incrementales
      const maxId = await Insumo.max('id');
      const newId = (maxId === null || maxId === undefined) ? 1000 : Number(maxId) + 1;
      await Insumo.create({
        id: newId,
        nombre,
        descripcion,
        precio,
        categoria: 'insumos',
        tipo: tipoInsumo || null,
        activo: activo === 'true',
        imagen: imagenPath,
      });
    } else {
      return res.redirect('/dashboard?error=Tipo de producto no válido');
    }

    res.redirect('/dashboard?mensaje=Producto creado exitosamente');
  } catch (err) {
    console.error('Error al crear producto:', err);
    const msg = err && err.message ? err.message : 'Error al crear producto';
    res.redirect('/dashboard?error=' + encodeURIComponent(msg));
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
    // Determinar si es impresora o insumo, aceptando variantes singular/plural
    const tipoProductoActual = String(producto.tipo_producto || producto.categoria || producto.tipo || '').toLowerCase();
    const esImpresora = tipoProductoActual.includes('impresora');

    const updateData = {
      nombre,
      descripcion,
      precio,
      categoria,
      tipo,
      activo: activo === 'true',
    };

    // Si subieron nueva imagen, actualizar la ruta
    if (req.file) {
      updateData.imagen = `/uploads/productos/${req.file.filename}`;
    }

    if (esImpresora) {
      await Impresora.update(updateData, { where: { id: productoId } });
    } else {
      await Insumo.update(updateData, { where: { id: productoId } });
    }

    res.redirect('/dashboard?mensaje=Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.redirect('/dashboard?error=Error al actualizar el producto');
  }
};

const getDetalleVenta = async (req, res) => {
  try {
    const ventaId = req.params.id;
    const venta = await Venta.findByPk(ventaId);
    if (!venta) return res.render('error', { mensaje: 'Venta no encontrada', activePage: 'ventas' });

    // Obtener items de la venta
    const itemsRaw = await VentaProducto.findAll({ where: { venta_id: ventaId } });

    // Enriquecer con nombre y precio desde la vista de productos
    const items = await Promise.all(itemsRaw.map(async it => {
      const producto = await VistaProductos.findByPk(it.producto_id);
      const nombre = producto ? producto.nombre : 'Producto eliminado';
      const precioUnitario = it.precio_unitario;
      const cantidad = it.cantidad;
      const subtotal = Number(precioUnitario) * Number(cantidad);
      return {
        nombre,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal
      };
    }));

    res.render('admin/detalleVenta', { venta, items, activePage: 'ventas' });
  } catch (error) {
    console.error('Error al obtener detalle de venta:', error);
    res.render('error', { mensaje: 'Error al cargar detalle de venta', activePage: 'ventas' });
  }
};

const getRegistros = async (req, res) => {
  try {
    // Obtener los últimos 10 logs desde la tabla SQL
    const logs = await Log.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    const registros = logs.map(l => ({
      timestamp: l.createdAt,
      adminId: l.adminId || null,
      email: l.email || null,
    }));
    res.render('registros', { registros, activePage: 'registros' });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.render('error', { mensaje: 'Error al obtener registros', activePage: 'registros' });
  }
};

const exportarLogsExcel = async (req, res) => {
  try {
    const logs = await Log.findAll({ order: [['createdAt', 'DESC']] });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Logs');

    sheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 25 },
      { header: 'Admin ID', key: 'adminId', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    logs.forEach(l => {
      let parsed = {};
      sheet.addRow({
        fecha: l.createdAt ? new Date(l.createdAt).toLocaleString() : '',
        adminId: l.adminId || '',
        email: l.email || '',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.xlsx"');
    return res.send(buffer);
  } catch (error) {
    console.error('Error al exportar logs a Excel:', error);
    return res.redirect('/registros?error=' + encodeURIComponent('Error al exportar logs'));
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
  getDetalleVenta,
  getRegistros,
  exportarLogsExcel,
  postDesactivar,
  postReactivar,
};
