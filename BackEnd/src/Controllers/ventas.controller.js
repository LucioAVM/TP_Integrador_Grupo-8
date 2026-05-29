import Venta from '../Models/venta.js';
import VentaProducto from '../Models/venta_productos.js';
import Producto from '../Models/producto.js';

export async function getVentas(req, res) {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: Producto,
        as: 'productos',
        attributes: ['id', 'nombre', 'categoria', 'tipo'],
        through: {
          attributes: ['cantidad', 'precio_unitario'],
        },
      },
    });
    res.render('ventas/index_ventas', { ventas, activePage: 'ventas' });
  } catch (error) {
    console.error('Error al cargar las ventas:', error.message);
    res.render('error', { mensaje: 'Error al cargar las ventas', activePage: 'ventas' });
  }
}

export async function getVentaDetalle(req, res) {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: {
        model: Producto,
        as: 'productos',
        attributes: ['id', 'nombre', 'categoria', 'tipo'],
        through: {
          attributes: ['cantidad', 'precio_unitario'],
        },
      },
    });
    if (!venta) {
      return res.render('error', { mensaje: 'Venta no encontrada', activePage: 'ventas' });
    }

    const items = (venta.productos || []).map(producto => {
      const ventaProducto = producto.VentaProducto || producto.VentaProducto;
      const cantidad = Number(ventaProducto?.cantidad || 0);
      const precioUnitario = Number(ventaProducto?.precio_unitario || 0);

      return {
        nombre: producto.nombre,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal: cantidad * precioUnitario,
      };
    });

    res.render('ventas/detalles_ventas', { venta, items, activePage: 'ventas' });
  } catch (error) {
    console.error('Error al obtener detalle de venta:', error);
    res.render('error', { mensaje: 'Error al obtener detalle de venta', activePage: 'ventas' });
  }
}

export async function postNuevaVenta(req, res) {
  try {
    const { nombre_usuario, productos, total } = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).render('error', { mensaje: 'Productos inválidos', activePage: 'ventas' });
    }

    await Venta.sequelize.transaction(async (transaction) => {
      const normalizedItems = [];

      for (const item of productos) {
        const productoId = Number(item.producto_id ?? item.id);
        const cantidad = Number(item.cantidad ?? 1);
        const precioUnitario = Number(item.precio_unitario ?? item.precio ?? 0);

        const producto = await Producto.findOne({
          where: { id: productoId, activo: true },
          transaction,
        });

        if (!producto) {
          throw new Error(`Producto con ID ${productoId} no encontrado o inactivo.`);
        }

        normalizedItems.push({ producto_id: productoId, cantidad, precio_unitario: precioUnitario });
      }

      const venta = await Venta.create({ nombre_usuario, total }, { transaction });

      await VentaProducto.bulkCreate(
        normalizedItems.map(item => ({
          venta_id: venta.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
        { transaction }
      );
    });

    res.redirect('/ventas');
  } catch (err) {
    console.error('Error al crear venta:', err);
    res.status(400).render('error', { mensaje: err.message || 'Error al registrar la venta.', activePage: 'ventas' });
  }
}

export default { getVentas, getVentaDetalle, postNuevaVenta };
