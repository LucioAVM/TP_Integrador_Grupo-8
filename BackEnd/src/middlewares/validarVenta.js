export function validarVenta(req, res, next) {
  const { nombre_usuario, productos, total } = req.body;
  const errores = [];

  if (!nombre_usuario?.trim()) {
    errores.push({ campo: 'nombre_usuario', mensaje: 'El nombre del usuario es obligatorio' });
  }
  if (!Array.isArray(productos) || productos.length === 0) {
    errores.push({ campo: 'productos', mensaje: 'Debe incluir al menos un producto' });
  } else {
    productos.forEach((item, index) => {
      const productoId = Number(item?.producto_id ?? item?.id);
      const cantidad = Number(item?.cantidad ?? 1);
      const precioUnitario = Number(item?.precio_unitario ?? item?.precio);

      if (!Number.isFinite(productoId) || productoId <= 0) {
        errores.push({ campo: `productos[${index}].producto_id`, mensaje: 'ID de producto inválido' });
      }
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        errores.push({ campo: `productos[${index}].cantidad`, mensaje: 'Cantidad inválida' });
      }
      if (!Number.isFinite(precioUnitario) || precioUnitario < 0) {
        errores.push({ campo: `productos[${index}].precio_unitario`, mensaje: 'Precio unitario inválido' });
      }
    });
  }
  if (!Number.isFinite(Number(total)) || Number(total) < 0) {
    errores.push({ campo: 'total', mensaje: 'Total inválido' });
  }

  if (errores.length) {
    return res.status(400).json({ errores });
  }

  next();
}
