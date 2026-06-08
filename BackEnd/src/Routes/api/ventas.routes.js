import express from 'express';
import Venta from '../../Models/venta.js';
import VentaProducto from '../../Models/venta_productos.js';
import Producto from '../../Models/producto.js';
import { validarVenta } from '../../middlewares/validarVenta.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: {
        model: Producto,
        as: 'productos',
        attributes: ['id', 'nombre', 'categoria', 'tipo', 'imagen'],
        through: {
          attributes: ['cantidad', 'precio_unitario'],
        },
      },
      order: [['id', 'DESC']],
    });
    res.json(ventas);
  } catch (err) {
    console.error('Error API GET /api/ventas:', err);
    res.status(500).json({ error: 'Error al consultar ventas' });
  }
});

// Registrar una venta (API público)
router.post('/', validarVenta, async (req, res) => {
  try {
    const { nombre_usuario, productos, total } = req.body;

    const venta = await Venta.sequelize.transaction(async (transaction) => {
      const normalizedItems = [];

      for (const item of productos) {
        const productoId = Number(item.producto_id ?? item.id);
        const cantidad = Number(item.cantidad ?? 1);
        const precioUnitario = Number(item.precio_unitario ?? item.precio ?? 0);

        if (!Number.isFinite(productoId) || !Number.isFinite(cantidad) || cantidad <= 0 || !Number.isFinite(precioUnitario)) {
          throw new Error(`Ítem inválido en el carrito: ${JSON.stringify(item)}`);
        }

        const producto = await Producto.findOne({
          where: { id: productoId, activo: true },
          transaction,
        });

        if (!producto) {
          throw new Error(`Producto con ID ${productoId} no encontrado o inactivo.`);
        }

        normalizedItems.push({
          producto_id: productoId,
          cantidad,
          precio_unitario: precioUnitario,
        });
      }

      const venta = await Venta.create(
        {
          nombre_usuario,
          total,
        },
        { transaction }
      );

      await VentaProducto.bulkCreate(
        normalizedItems.map(item => ({
          venta_id: venta.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
        { transaction }
      );

      return venta;
    });

    res.status(201).json({ mensaje: 'Venta registrada exitosamente.', ventaId: venta.id });
  } catch (err) {
    console.error('Error API /api/ventas:', err);
    const status = String(err.message || '').includes('no encontrado') ? 400 : 500;
    res.status(status).json({ error: err.message || 'Error al registrar la venta.' });
  }
});

export default router;
