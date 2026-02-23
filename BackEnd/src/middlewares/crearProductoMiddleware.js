import Impresora from '../Models/impresora.js';
import Insumo from '../models/insumo.js';

// Función para validar los datos comunes
const validarDatosComunes = (body) => {
  const { tipoProducto, nombre, precio, descripcion, activo } = body;
  if (!tipoProducto || !nombre || !precio || !descripcion || !activo) {
    throw new Error('Todos los campos comunes son obligatorios.');
  }
};

// Función para manejar la lógica de creación de productos
const manejarCreacionProducto = async (body) => {
  const { tipoProducto, nombre, precio, descripcion, activo, tipoImpresora, tipoInsumo } = body;

  validarDatosComunes(body);

  if (tipoProducto === 'impresoras') {
    if (!tipoImpresora) {
      throw new Error('El tipo de impresora es obligatorio.');
    }
    await Impresora.create({
      nombre,
      descripcion,
      precio,
      categoria: 'impresoras',
      tipo: tipoImpresora,
      activo: activo === 'true',
    });
  } else if (tipoProducto === 'insumos') {
    if (!tipoInsumo) {
      throw new Error('El tipo de insumo es obligatorio.');
    }
    await Insumo.create({
      nombre,
      descripcion,
      precio,
      categoria: 'insumos',
      tipo: tipoInsumo,
      activo: activo === 'true',
    });
  } else {
    throw new Error('Tipo de producto no válido.');
  }
};

// Middleware para manejar la lógica de creación de productos
const crearProductoMiddleware = async (req, res, next) => {
  try {
    console.log('Datos recibidos:', req.body);

    await manejarCreacionProducto(req.body);

    res.redirect('/dashboard?mensaje=Producto creado exitosamente');
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.redirect('/dashboard?error=Error al crear producto');
  }
};

export { crearProductoMiddleware };