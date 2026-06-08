// Middleware de validación para creación de producto.
// Esta versión sólo valida la presencia de campos requeridos
// y delega la persistencia al controlador.

function responderErrorProducto(req, res, mensaje) {
  if (req.originalUrl?.startsWith('/api')) {
    return res.status(400).json({ error: mensaje });
  }
  return res.redirect(`/dashboard?error=${encodeURIComponent(mensaje)}`);
}

function validarProducto(req, res, next) {
  try {
    const categoria = req.body.categoria || req.body.tipoProducto || req.body.tipo_producto;
    const { nombre, precio, descripcion, activo } = req.body;

    if (!categoria || !nombre || !precio || !descripcion || activo === undefined) {
      return responderErrorProducto(req, res, 'Todos los campos son obligatorios');
    }

    next();
  } catch (err) {
    console.error('Error en validación de producto:', err);
    return responderErrorProducto(req, res, 'Error en validación de producto');
  }
}

export { validarProducto };