// Middleware de validación para creación de producto.
// Esta versión sólo valida la presencia de campos requeridos
// y delega la persistencia al controlador.

function validarProducto(req, res, next) {
  try {
    const { tipoProducto, nombre, precio, descripcion, activo } = req.body;
    if (!tipoProducto || !nombre || !precio || !descripcion || (activo === undefined)) {
      return res.redirect('/dashboard?error=Todos los campos son obligatorios');
    }

    if (tipoProducto === 'impresoras' && !req.body.tipoImpresora) {
      return res.redirect('/dashboard?error=El tipo de impresora es obligatorio');
    }
    if (tipoProducto === 'insumos' && !req.body.tipoInsumo) {
      return res.redirect('/dashboard?error=El tipo de insumo es obligatorio');
    }

    // Si llega hasta acá, la validación básica pasó
    next();
  } catch (err) {
    console.error('Error en validación de producto:', err);
    return res.redirect('/dashboard?error=Error en validación de producto');
  }
}

export { validarProducto };