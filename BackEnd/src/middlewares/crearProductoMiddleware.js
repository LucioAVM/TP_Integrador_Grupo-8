// Middleware de validación para creación de producto.
// Esta versión sólo valida la presencia de campos requeridos
// y delega la persistencia al controlador.

function validarProducto(req, res, next) {
  try {
    const categoria = req.body.categoria || req.body.tipoProducto || req.body.tipo_producto;
    const { nombre, precio, descripcion, activo } = req.body;

    if (!categoria || !nombre || !precio || !descripcion || activo === undefined) {
      return res.redirect('/dashboard?error=Todos los campos son obligatorios');
    }

    // Si llega hasta acá, la validación básica pasó
    next();
  } catch (err) {
    console.error('Error en validación de producto:', err);
    return res.redirect('/dashboard?error=Error en validación de producto');
  }
}

export { validarProducto };