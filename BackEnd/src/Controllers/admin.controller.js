import bcrypt from 'bcryptjs';
import Admin from '../Models/admin.js';
import Producto from '../Models/producto.js';
import { Op, QueryTypes } from 'sequelize';
import Venta from '../Models/venta.js';
import VentaProducto from '../Models/venta_productos.js';
import Log from '../Models/log.js';
import Encuesta from '../Models/Encuesta.js';
import ExcelJS from 'exceljs';
// La validación se aplica en la ruta mediante `validarProducto` y multer

const DATE_FILTER_FIELDS = ['fecha', 'createdAt', 'created_at', 'fecha_venta'];

const construirFiltroFechas = (fechaInicio, fechaFin, campoFecha = 'fecha') => {
  const where = {};

  if (fechaInicio || fechaFin) {
    where[campoFecha] = {};

    if (fechaInicio) {
      where[campoFecha][Op.gte] = new Date(`${fechaInicio}T00:00:00.000Z`);
    }

    if (fechaFin) {
      where[campoFecha][Op.lte] = new Date(`${fechaFin}T23:59:59.999Z`);
    }
  }

  return where;
};

const obtenerColumnaFechaVentas = async () => {
  const columnas = await Venta.sequelize.getQueryInterface().describeTable('ventas');
  return DATE_FILTER_FIELDS.find(campo => columnas[campo]) || null;
};

const obtenerTopProductosVendidos = async (limit = 10) => {
  const topProductosRaw = await VentaProducto.findAll({
    attributes: [
      'producto_id',
      [Venta.sequelize.fn('SUM', Venta.sequelize.col('cantidad')), 'total_vendido']
    ],
    group: ['producto_id'],
    order: [[Venta.sequelize.literal('total_vendido'), 'DESC']],
    limit
  });

  return Promise.all(topProductosRaw.map(async item => {
    const producto = await Producto.findByPk(item.producto_id);
    return {
      producto_id: item.producto_id,
      nombre: producto?.nombre || 'Producto eliminado',
      total_vendido: Number(item.dataValues.total_vendido || 0),
    };
  }));
};

const obtenerTotalRecaudadoPorMes = async () => {
  const columnaFecha = await obtenerColumnaFechaVentas();
  if (!columnaFecha) return [];

  return Venta.sequelize.query(
    `SELECT
      CONVERT(VARCHAR(7), [${columnaFecha}], 120) AS mes,
      SUM(CAST(total AS DECIMAL(18,2))) AS total_recaudado,
      COUNT(*) AS total_ventas
    FROM ventas
    GROUP BY CONVERT(VARCHAR(7), [${columnaFecha}], 120)
    ORDER BY mes DESC`,
    { type: QueryTypes.SELECT }
  );
};

const obtenerTopClientes = async (limit = 5) => {
  return Venta.sequelize.query(
    `SELECT TOP ${Number(limit)}
      nombre_usuario,
      COUNT(*) AS total_compras,
      SUM(CAST(total AS DECIMAL(18,2))) AS total_gastado
    FROM ventas
    GROUP BY nombre_usuario
    ORDER BY total_gastado DESC, total_compras DESC, nombre_usuario ASC`,
    { type: QueryTypes.SELECT }
  );
};

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
    const productos = await Producto.findAll();
    const totalVentas = await Venta.count();
    const totalIngresosRaw = await Venta.sum('total');

    const totalProductos = productos.length;
    const productosActivos = productos.filter(producto => producto.activo).length;
    const totalIngresos = Number(totalIngresosRaw || 0);

    const mensaje = req.query.mensaje || null;
    const error = req.query.error || null;
    res.render('dashboard', {
      admin,
      productos,
      totalProductos,
      productosActivos,
      totalVentas,
      totalIngresos,
      mensaje,
      error,
      activePage: 'dashboard'
    });
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

    const { count, rows } = await Producto.findAndCountAll({ where, limit, offset, order: [['id', 'ASC']] });

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
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.render('error', { mensaje: 'Producto no encontrado', activePage: 'productos' });
    res.render('productos/detalle', { producto, activePage: 'productos' });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar detalle', activePage: 'productos' });
  }
};

const getCrearProducto = (req, res) => {
  res.render('crearProducto', { activePage: 'productos' });
};

const postCrearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, tipo, activo } = req.body;
    const imagen = req.file ? `/uploads/productos/${req.file.filename}` : null;

    await Producto.create({
      nombre,
      descripcion,
      precio,
      categoria,
      tipo,
      activo: activo === 'true',
      imagen,
    });

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
    const producto = await Producto.findByPk(productoId);
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
    const producto = await Producto.findByPk(productoId);
    if (!producto) return res.redirect('/dashboard?error=Producto no encontrado');
    const updateData = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      categoria: req.body.categoria,
      tipo: req.body.tipo,
      activo: req.body.activo === 'true',
      imagen: req.file ? `/uploads/productos/${req.file.filename}` : producto.imagen,
    };

    await producto.update(updateData);

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
      const producto = await Producto.findByPk(it.producto_id);
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

    // 10 Ventas más caras
    const topVentas = await Venta.findAll({
      order: [['total', 'DESC']],
      limit: 10
    });

    // 10 Productos más vendidos
    const topProductos = await obtenerTopProductosVendidos(10);

    const totalRecaudadoPorMes = await obtenerTotalRecaudadoPorMes();
    const topClientes = await obtenerTopClientes(5);

    res.render('registros', { 
      registros, 
      topVentas,
      topProductos,
      totalRecaudadoPorMes,
      topClientes,
      activePage: 'registros' 
    });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.render('error', { mensaje: 'Error al obtener registros', activePage: 'registros' });
  }
};

const getAsistencia = async (req, res) => {
  try {
    const fechaInicio = req.query.fechaInicio || req.query.fechaDesde || null;
    const fechaFin = req.query.fechaFin || req.query.fechaHasta || null;
    const whereEncuestas = construirFiltroFechas(fechaInicio, fechaFin, 'fecha');

    const ultimasEncuestas = await Encuesta.findAll({
      where: whereEncuestas,
      order: [['fecha', 'DESC']],
      limit: 5
    });

    const encuestasBajas = await Encuesta.findAll({
      where: {
        ...whereEncuestas,
        puntuacion: { [Op.lte]: 3 }
      },
      order: [['puntuacion', 'ASC'], ['fecha', 'DESC']],
      limit: 5
    });

    res.render('asistencia', { 
      ultimasEncuestas,
      encuestasBajas,
      filtros: { fechaInicio, fechaFin },
      activePage: 'asistencia' 
    });
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    res.render('error', { mensaje: 'Error al cargar la pantalla de asistencia', activePage: 'asistencia' });
  }
};

const exportarLogsExcel = async (req, res) => {
  try {
    const logs = await Log.findAll({ order: [['createdAt', 'DESC']] });
    const topVentas = await Venta.findAll({ order: [['total', 'DESC']], limit: 10 });
    const topProductos = await obtenerTopProductosVendidos(10);
    const totalRecaudadoPorMes = await obtenerTotalRecaudadoPorMes();
    const topClientes = await obtenerTopClientes(5);

    const workbook = new ExcelJS.Workbook();
    const sheetVentas = workbook.addWorksheet('Ventas');
    sheetVentas.columns = [
      { header: 'ID Venta', key: 'id', width: 12 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Total', key: 'total', width: 15 },
    ];
    topVentas.forEach(v => {
      sheetVentas.addRow({
        id: v.id,
        cliente: v.nombre_usuario,
        total: Number(v.total).toFixed(2),
      });
    });

    const sheetProductos = workbook.addWorksheet('Productos');
    sheetProductos.columns = [
      { header: 'ID Producto', key: 'producto_id', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 35 },
      { header: 'Cantidad vendida', key: 'total_vendido', width: 18 },
    ];
    topProductos.forEach(p => {
      sheetProductos.addRow({
        producto_id: p.producto_id,
        nombre: p.nombre,
        total_vendido: p.total_vendido,
      });
    });

    const sheetEstadisticas = workbook.addWorksheet('Estadisticas');
    sheetEstadisticas.columns = [
      { header: 'Mes', key: 'mes', width: 15 },
      { header: 'Total recaudado', key: 'total_recaudado', width: 18 },
      { header: 'Total ventas', key: 'total_ventas', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Compras', key: 'compras', width: 12 },
      { header: 'Gastado', key: 'gastado', width: 15 },
    ];
    const maxRows = Math.max(totalRecaudadoPorMes.length, topClientes.length);
    for (let i = 0; i < maxRows; i += 1) {
      const mes = totalRecaudadoPorMes[i];
      const cliente = topClientes[i];
      sheetEstadisticas.addRow({
        mes: mes?.mes || '',
        total_recaudado: mes ? Number(mes.total_recaudado).toFixed(2) : '',
        total_ventas: mes?.total_ventas || '',
        cliente: cliente?.nombre_usuario || '',
        compras: cliente?.total_compras || '',
        gastado: cliente ? Number(cliente.total_gastado).toFixed(2) : '',
      });
    }

    const sheetLogs = workbook.addWorksheet('Logs');
    sheetLogs.columns = [
      { header: 'Fecha', key: 'fecha', width: 25 },
      { header: 'Admin ID', key: 'adminId', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
    ];
    logs.forEach(l => {
      sheetLogs.addRow({
        fecha: l.createdAt ? new Date(l.createdAt).toLocaleString() : '',
        adminId: l.adminId || '',
        email: l.email || '',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="registros.xlsx"');
    return res.send(buffer);
  } catch (error) {
    console.error('Error al exportar logs a Excel:', error);
    return res.redirect('/registros?error=' + encodeURIComponent('Error al exportar registros'));
  }
};

const postDesactivar = async (req, res) => {
  try {
    const productoId = req.params.id;
    const producto = await Producto.findByPk(productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.update({ activo: false });
    res.json(producto);
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    res.status(500).json({ error: 'Error al desactivar producto' });
  }
};

const postReactivar = async (req, res) => {
  try {
    const productoId = req.params.id;
    const producto = await Producto.findByPk(productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.update({ activo: true });
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
  getAsistencia,
  exportarLogsExcel,
  postDesactivar,
  postReactivar,
};
