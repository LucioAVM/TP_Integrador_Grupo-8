import bcrypt from 'bcryptjs';
import Admin from '../Models/admin.js';
import Producto from '../Models/producto.js';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import Venta from '../Models/venta.js';
import VentaProducto from '../Models/venta_productos.js';
import Log from '../Models/log.js';
import Encuesta from '../Models/Encuesta.js';
import ExcelJS from 'exceljs';
// La validación se aplica en la ruta mediante `validarProducto` y multer

const DATE_FILTER_FIELDS = ['fecha', 'createdAt', 'created_at', 'fecha_venta'];

const construirFiltroFechas = (fechaInicio, fechaFin, campoFecha = 'fecha') => {
  const condiciones = [];

  // SQL Server no acepta offsets tipo "-03:00" en datetime; comparar por DATE evita el error.
  if (fechaInicio) {
    condiciones.push(
      Sequelize.where(
        Sequelize.fn('CONVERT', Sequelize.literal('DATE'), Sequelize.col(campoFecha)),
        Op.gte,
        fechaInicio
      )
    );
  }

  if (fechaFin) {
    condiciones.push(
      Sequelize.where(
        Sequelize.fn('CONVERT', Sequelize.literal('DATE'), Sequelize.col(campoFecha)),
        Op.lte,
        fechaFin
      )
    );
  }

  if (!condiciones.length) return {};

  return { [Op.and]: condiciones };
};

const combinarFiltroEncuestas = (filtroFechas, condicionesExtra = []) => {
  const base = filtroFechas[Op.and] || [];
  const extras = condicionesExtra.filter(Boolean);

  if (!base.length && !extras.length) return {};
  return { [Op.and]: [...base, ...extras] };
};

const esFechaFiltroValida = (fecha) =>
  typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha);

const normalizarFiltroFechas = (fechaInicio, fechaFin) => ({
  fechaInicio: esFechaFiltroValida(fechaInicio) ? fechaInicio : null,
  fechaFin: esFechaFiltroValida(fechaFin) ? fechaFin : null,
});

const hayFiltroActivo = (fechaInicio, fechaFin) => Boolean(fechaInicio || fechaFin);

const construirCondicionSqlFecha = (fechaInicio, fechaFin, columnaFecha, alias = '') => {
  const col = alias ? `${alias}.[${columnaFecha}]` : `[${columnaFecha}]`;
  const partes = [];

  if (fechaInicio) partes.push(`CONVERT(DATE, ${col}) >= '${fechaInicio}'`);
  if (fechaFin) partes.push(`CONVERT(DATE, ${col}) <= '${fechaFin}'`);

  return partes.join(' AND ');
};

const obtenerColumnaFechaVentas = async () => {
  const columnas = await Venta.sequelize.getQueryInterface().describeTable('ventas');
  return DATE_FILTER_FIELDS.find(campo => columnas[campo]) || null;
};

const obtenerTopProductosVendidos = async (limit = 10, fechaInicio = null, fechaFin = null) => {
  const columnaFecha = await obtenerColumnaFechaVentas();

  if (hayFiltroActivo(fechaInicio, fechaFin) && columnaFecha) {
    const condicion = construirCondicionSqlFecha(fechaInicio, fechaFin, columnaFecha, 'v');
    const topProductosRaw = await Venta.sequelize.query(
      `SELECT TOP ${Number(limit)}
        vp.producto_id,
        SUM(vp.cantidad) AS total_vendido
      FROM venta_productos vp
      INNER JOIN ventas v ON v.id = vp.venta_id
      WHERE ${condicion}
      GROUP BY vp.producto_id
      ORDER BY total_vendido DESC`,
      { type: QueryTypes.SELECT }
    );

    return Promise.all(topProductosRaw.map(async (item) => {
      const producto = await Producto.findByPk(item.producto_id);
      return {
        producto_id: item.producto_id,
        nombre: producto?.nombre || 'Producto eliminado',
        total_vendido: Number(item.total_vendido || 0),
      };
    }));
  }

  const topProductosRaw = await VentaProducto.findAll({
    attributes: [
      'producto_id',
      [Venta.sequelize.fn('SUM', Venta.sequelize.col('cantidad')), 'total_vendido'],
    ],
    group: ['producto_id'],
    order: [[Venta.sequelize.literal('total_vendido'), 'DESC']],
    limit,
  });

  return Promise.all(topProductosRaw.map(async (item) => {
    const producto = await Producto.findByPk(item.producto_id);
    return {
      producto_id: item.producto_id,
      nombre: producto?.nombre || 'Producto eliminado',
      total_vendido: Number(item.dataValues.total_vendido || 0),
    };
  }));
};

const obtenerTotalRecaudadoPorMes = async (fechaInicio = null, fechaFin = null) => {
  const columnaFecha = await obtenerColumnaFechaVentas();
  if (!columnaFecha) return [];

  const condicion = construirCondicionSqlFecha(fechaInicio, fechaFin, columnaFecha);
  const where = condicion ? `WHERE ${condicion}` : '';

  return Venta.sequelize.query(
    `SELECT
      CONVERT(VARCHAR(7), [${columnaFecha}], 120) AS mes,
      SUM(CAST(total AS DECIMAL(18,2))) AS total_recaudado,
      COUNT(*) AS total_ventas
    FROM ventas
    ${where}
    GROUP BY CONVERT(VARCHAR(7), [${columnaFecha}], 120)
    ORDER BY mes DESC`,
    { type: QueryTypes.SELECT }
  );
};

const obtenerTopClientes = async (limit = 5, fechaInicio = null, fechaFin = null) => {
  const columnaFecha = await obtenerColumnaFechaVentas();
  const condicion = columnaFecha
    ? construirCondicionSqlFecha(fechaInicio, fechaFin, columnaFecha)
    : '';
  const where = condicion ? `WHERE ${condicion}` : '';

  return Venta.sequelize.query(
    `SELECT TOP ${Number(limit)}
      nombre_usuario,
      COUNT(*) AS total_compras,
      SUM(CAST(total AS DECIMAL(18,2))) AS total_gastado
    FROM ventas
    ${where}
    GROUP BY nombre_usuario
    ORDER BY total_gastado DESC, total_compras DESC, nombre_usuario ASC`,
    { type: QueryTypes.SELECT }
  );
};

const obtenerTopVentasCaras = async (limit = 10, fechaInicio = null, fechaFin = null) => {
  const columnaFecha = await obtenerColumnaFechaVentas();
  const fechaExpr = columnaFecha ? `[${columnaFecha}] AS fecha` : 'NULL AS fecha';
  const condicion = columnaFecha
    ? construirCondicionSqlFecha(fechaInicio, fechaFin, columnaFecha)
    : '';
  const where = condicion ? `WHERE ${condicion}` : '';

  return Venta.sequelize.query(
    `SELECT TOP ${Number(limit)}
      id,
      nombre_usuario,
      total,
      ${fechaExpr}
    FROM ventas
    ${where}
    ORDER BY total DESC`,
    { type: QueryTypes.SELECT }
  );
};

const EXCEL_HEADER_FILL = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E3A5F' },
};

const EXCEL_HEADER_FONT = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 11,
};

const aplicarEstiloTabla = (sheet, opciones = {}) => {
  const { monedaCols = [], fechaCols = [] } = opciones;
  if (!sheet.rowCount) return;

  const header = sheet.getRow(1);
  header.font = EXCEL_HEADER_FONT;
  header.fill = EXCEL_HEADER_FILL;
  header.alignment = { vertical: 'middle', horizontal: 'center' };
  header.height = 24;

  const colCount = sheet.columnCount || sheet.columns?.length || 0;
  if (colCount > 0 && sheet.rowCount > 1) {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: colCount },
    };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  monedaCols.forEach((colIdx) => {
    const letter = sheet.getColumn(colIdx).letter;
    for (let row = 2; row <= sheet.rowCount; row += 1) {
      const cell = sheet.getCell(`${letter}${row}`);
      if (typeof cell.value === 'number') {
        cell.numFmt = '"$"#,##0.00';
      }
    }
  });

  fechaCols.forEach((colIdx) => {
    const letter = sheet.getColumn(colIdx).letter;
    for (let row = 2; row <= sheet.rowCount; row += 1) {
      const cell = sheet.getCell(`${letter}${row}`);
      if (cell.value instanceof Date) {
        cell.numFmt = 'dd/mm/yyyy hh:mm';
      }
    }
  });
};

const crearHojaResumen = (workbook, datos) => {
  const sheet = workbook.addWorksheet('Resumen');
  sheet.columns = [{ width: 30 }, { width: 42 }];

  sheet.mergeCells('A1:B1');
  const titulo = sheet.getCell('A1');
  titulo.value = 'Fenrir 3D — Reporte de registros';
  titulo.font = { bold: true, size: 14, color: { argb: 'FF1E3A5F' } };
  titulo.alignment = { horizontal: 'center' };

  const filas = [
    ['Generado', new Date()],
    ['Filtro encuestas desde', datos.fechaInicio || 'Sin filtro'],
    ['Filtro encuestas hasta', datos.fechaFin || 'Sin filtro'],
    ['Total de ventas', datos.totalVentas],
    ['Total recaudado', Number(datos.totalRecaudado || 0)],
    ['Total encuestas', datos.totalEncuestas],
    ['Promedio puntuación encuestas', datos.promedioEncuestas ?? '—'],
    ['Total logs de acceso', datos.totalLogs],
  ];

  filas.forEach(([label, value], index) => {
    const rowNumber = index + 3;
    sheet.getCell(`A${rowNumber}`).value = label;
    sheet.getCell(`A${rowNumber}`).font = { bold: true };
    const valueCell = sheet.getCell(`B${rowNumber}`);
    valueCell.value = value;
    if (label === 'Generado' && value instanceof Date) {
      valueCell.numFmt = 'dd/mm/yyyy hh:mm';
    }
    if (label === 'Total recaudado' && typeof value === 'number') {
      valueCell.numFmt = '"$"#,##0.00';
    }
    if (label === 'Promedio puntuación encuestas' && typeof value === 'number') {
      valueCell.numFmt = '0.00';
    }
  });
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
    const insumos = productos.filter(producto => producto.categoria === 'insumo');
    const impresoras = productos.filter(producto => producto.categoria === 'impresora');

    const mensaje = req.query.mensaje || null;
    const error = req.query.error || null;
    res.render('dashboard', {
      admin,
      productos,
      insumos,
      impresoras,
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
    const { fechaInicio, fechaFin } = normalizarFiltroFechas(
      req.query.fechaInicio || req.query.fechaDesde || null,
      req.query.fechaFin || req.query.fechaHasta || null
    );
    const filtroActivo = hayFiltroActivo(fechaInicio, fechaFin);
    const limiteTablas = filtroActivo ? 100 : 10;

    const whereEncuestas = construirFiltroFechas(fechaInicio, fechaFin, 'fecha');
    const whereLogs = filtroActivo
      ? construirFiltroFechas(fechaInicio, fechaFin, 'createdAt')
      : {};

    const logs = await Log.findAll({
      where: whereLogs,
      order: [['createdAt', 'DESC']],
      limit: limiteTablas,
    });
    const registros = logs.map((l) => ({
      timestamp: l.createdAt,
      adminId: l.adminId || null,
      email: l.email || null,
    }));

    const [
      topVentas,
      topProductos,
      totalRecaudadoPorMes,
      topClientes,
      ultimasEncuestas,
      encuestasAsistencia,
    ] = await Promise.all([
      obtenerTopVentasCaras(10, fechaInicio, fechaFin),
      obtenerTopProductosVendidos(10, fechaInicio, fechaFin),
      obtenerTotalRecaudadoPorMes(fechaInicio, fechaFin),
      obtenerTopClientes(5, fechaInicio, fechaFin),
      Encuesta.findAll({
        where: whereEncuestas,
        order: [['fecha', 'DESC']],
        limit: limiteTablas,
      }),
      Encuesta.findAll({
        where: combinarFiltroEncuestas(whereEncuestas, [{ puntuacion: { [Op.lte]: 3 } }]),
        order: [['puntuacion', 'ASC'], ['fecha', 'DESC']],
        limit: limiteTablas,
      }),
    ]);

    res.render('registros', {
      registros,
      topVentas,
      topProductos,
      totalRecaudadoPorMes,
      topClientes,
      ultimasEncuestas,
      encuestasAsistencia,
      filtros: { fechaInicio, fechaFin },
      filtroActivo,
      activePage: 'registros',
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
      where: combinarFiltroEncuestas(whereEncuestas, [{ puntuacion: { [Op.lte]: 3 } }]),
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
    const fechaInicio = req.query.fechaInicio || req.query.fechaDesde || null;
    const fechaFin = req.query.fechaFin || req.query.fechaHasta || null;
    const whereEncuestas = construirFiltroFechas(fechaInicio, fechaFin, 'fecha');

    const [
      logs,
      topVentas,
      topProductos,
      totalRecaudadoPorMes,
      topClientes,
      encuestas,
      encuestasAsistencia,
      totalVentas,
      totalRecaudadoRaw,
      promedioEncuestasRaw,
    ] = await Promise.all([
      Log.findAll({ order: [['createdAt', 'DESC']] }),
      obtenerTopVentasCaras(10),
      obtenerTopProductosVendidos(10),
      obtenerTotalRecaudadoPorMes(),
      obtenerTopClientes(10),
      Encuesta.findAll({ where: whereEncuestas, order: [['fecha', 'DESC']] }),
      Encuesta.findAll({
        where: combinarFiltroEncuestas(whereEncuestas, [{ puntuacion: { [Op.lte]: 3 } }]),
        order: [['puntuacion', 'ASC'], ['fecha', 'DESC']],
      }),
      Venta.count(),
      Venta.sum('total'),
      Encuesta.aggregate('puntuacion', 'avg', { where: whereEncuestas }),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Fenrir 3D Admin';
    workbook.created = new Date();

    crearHojaResumen(workbook, {
      fechaInicio,
      fechaFin,
      totalVentas,
      totalRecaudado: totalRecaudadoRaw,
      totalEncuestas: encuestas.length,
      promedioEncuestas: promedioEncuestasRaw != null
        ? Number(promedioEncuestasRaw)
        : null,
      totalLogs: logs.length,
    });

    const sheetMeses = workbook.addWorksheet('Recaudado por mes');
    sheetMeses.columns = [
      { header: 'Mes', key: 'mes', width: 14 },
      { header: 'Total recaudado', key: 'total_recaudado', width: 18 },
      { header: 'Cantidad de ventas', key: 'total_ventas', width: 18 },
    ];
    totalRecaudadoPorMes.forEach((mes) => {
      sheetMeses.addRow({
        mes: mes.mes,
        total_recaudado: Number(mes.total_recaudado || 0),
        total_ventas: Number(mes.total_ventas || 0),
      });
    });
    aplicarEstiloTabla(sheetMeses, { monedaCols: [2] });

    const sheetClientes = workbook.addWorksheet('Top clientes');
    sheetClientes.columns = [
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Compras', key: 'compras', width: 12 },
      { header: 'Total gastado', key: 'gastado', width: 18 },
    ];
    topClientes.forEach((cliente) => {
      sheetClientes.addRow({
        cliente: cliente.nombre_usuario,
        compras: Number(cliente.total_compras || 0),
        gastado: Number(cliente.total_gastado || 0),
      });
    });
    aplicarEstiloTabla(sheetClientes, { monedaCols: [3] });

    const sheetVentas = workbook.addWorksheet('Top ventas');
    sheetVentas.columns = [
      { header: 'ID Venta', key: 'id', width: 12 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 28 },
      { header: 'Total', key: 'total', width: 16 },
    ];
    topVentas.forEach((venta) => {
      sheetVentas.addRow({
        id: venta.id,
        fecha: venta.fecha ? new Date(venta.fecha) : null,
        cliente: venta.nombre_usuario,
        total: Number(venta.total || 0),
      });
    });
    aplicarEstiloTabla(sheetVentas, { monedaCols: [4], fechaCols: [2] });

    const sheetProductos = workbook.addWorksheet('Top productos');
    sheetProductos.columns = [
      { header: 'ID Producto', key: 'producto_id', width: 14 },
      { header: 'Nombre', key: 'nombre', width: 38 },
      { header: 'Cantidad vendida', key: 'total_vendido', width: 18 },
    ];
    topProductos.forEach((producto) => {
      sheetProductos.addRow({
        producto_id: producto.producto_id,
        nombre: producto.nombre,
        total_vendido: producto.total_vendido,
      });
    });
    aplicarEstiloTabla(sheetProductos);

    const sheetLogs = workbook.addWorksheet('Logs acceso');
    sheetLogs.columns = [
      { header: 'Fecha', key: 'fecha', width: 22 },
      { header: 'Admin ID', key: 'adminId', width: 12 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Mensaje', key: 'mensaje', width: 50 },
    ];
    logs.forEach((log) => {
      sheetLogs.addRow({
        fecha: log.createdAt ? new Date(log.createdAt) : null,
        adminId: log.adminId || '',
        email: log.email || '',
        mensaje: log.mensaje || '',
      });
    });
    aplicarEstiloTabla(sheetLogs, { fechaCols: [1] });

    const sheetEncuestas = workbook.addWorksheet('Encuestas');
    sheetEncuestas.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Puntuación', key: 'puntuacion', width: 12 },
      { header: 'Términos', key: 'terminos', width: 12 },
      { header: 'Comentario', key: 'comentario', width: 45 },
      { header: 'Imagen', key: 'imagen', width: 40 },
    ];
    encuestas.forEach((encuesta) => {
      sheetEncuestas.addRow({
        id: encuesta.id,
        fecha: encuesta.fecha ? new Date(encuesta.fecha) : null,
        email: encuesta.email || '',
        puntuacion: encuesta.puntuacion,
        terminos: encuesta.terminos ? 'Sí' : 'No',
        comentario: encuesta.comentario || '',
        imagen: encuesta.imagen || '',
      });
    });
    aplicarEstiloTabla(sheetEncuestas, { fechaCols: [2] });

    const sheetAsistencia = workbook.addWorksheet('Asistencia');
    sheetAsistencia.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Puntuación', key: 'puntuacion', width: 12 },
      { header: 'Comentario', key: 'comentario', width: 50 },
      { header: 'Imagen', key: 'imagen', width: 40 },
    ];
    encuestasAsistencia.forEach((encuesta) => {
      sheetAsistencia.addRow({
        id: encuesta.id,
        fecha: encuesta.fecha ? new Date(encuesta.fecha) : null,
        email: encuesta.email || '',
        puntuacion: encuesta.puntuacion,
        comentario: encuesta.comentario || '',
        imagen: encuesta.imagen || '',
      });
    });
    aplicarEstiloTabla(sheetAsistencia, { fechaCols: [2] });

    const buffer = await workbook.xlsx.writeBuffer();
    const fechaArchivo = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="fenrir-registros-${fechaArchivo}.xlsx"`);
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
