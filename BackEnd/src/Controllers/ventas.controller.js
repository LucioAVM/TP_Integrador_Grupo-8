import Venta from '../Models/venta.js';
import VentaProducto from '../Models/venta_productos.js';
import VistaProductos from '../Models/vista_productos.js';

export async function getVentas(req, res) {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: VentaProducto,
        attributes: ['producto_id', 'cantidad', 'precio_unitario'],
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
    const venta = await Venta.findByPk(req.params.id, { include: VentaProducto });
    if (!venta) {
      return res.render('error', { mensaje: 'Venta no encontrada', activePage: 'ventas' });
    }
    res.render('ventas/detalle_ventas', { venta, activePage: 'ventas' });
  } catch (error) {
    console.error('Error al obtener detalle de venta:', error);
    res.render('error', { mensaje: 'Error al obtener detalle de venta', activePage: 'ventas' });
  }
}

export async function postNuevaVenta(req, res) {
  try {
    const { nombre_usuario, productos, total } = req.body;
    for (const p of productos) {
      const producto = await VistaProductos.findByPk(p.producto_id);
      if (!producto) {
        return res.status(400).render('error', { mensaje: `Producto con ID ${p.producto_id} no encontrado.`, activePage: 'ventas' });
      }
    }

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
  } catch (err) {
    console.error('Error al crear venta:', err);
    res.render('error', { mensaje: 'Error al registrar la venta.', activePage: 'ventas' });
  }
}

export default { getVentas, getVentaDetalle, postNuevaVenta };
