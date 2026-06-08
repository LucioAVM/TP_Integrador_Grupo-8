import Producto from '../Models/producto.js';
import { Op } from 'sequelize';

const normalizeBool = v => (v === true || v === 'true' || v === 1 || v === '1');

async function list({ page = 1, limit = 6, q = null, categoria = null, tipo = null } = {}) {
  const offset = (page - 1) * limit;
  const where = { activo: true };
  if (q) {
    if (!isNaN(Number(q))) where.id = Number(q);
    else where.nombre = { [Op.like]: `%${q}%` };
  }
  if (categoria) where.categoria = categoria;
  if (tipo) where.tipo = tipo;

  const { count, rows } = await Producto.findAndCountAll({ where, limit, offset, order: [['id', 'ASC']] });
  const totalPages = Math.max(Math.ceil(count / limit), 1);
  const safePage = Math.min(page, totalPages);
  return { products: rows, total: count, totalPages, page: safePage, limit };
}

async function getById(id) {
  return await Producto.findOne({ where: { id, activo: true } });
}

async function createProduct(data) {
  const categoria = data.categoria || data.tipoProducto || data.tipo_producto;
  if (!categoria) throw new Error('categoria es requerida');

  return await Producto.create({
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: data.precio,
    imagen: data.imagen || null,
    categoria,
    tipo: data.tipo || data.tipoImpresora || data.tipoInsumo || null,
    activo: normalizeBool(data.activo),
  });
}

async function updateProduct(id, data) {
  const producto = await Producto.findByPk(id);
  if (!producto) return null;

  await producto.update({
    nombre: data.nombre ?? producto.nombre,
    descripcion: data.descripcion ?? producto.descripcion,
    precio: data.precio ?? producto.precio,
    imagen: data.imagen ?? producto.imagen,
    categoria: data.categoria ?? data.tipoProducto ?? data.tipo_producto ?? producto.categoria,
    tipo: data.tipo ?? data.tipoImpresora ?? data.tipoInsumo ?? producto.tipo,
    activo: data.activo === undefined ? producto.activo : normalizeBool(data.activo),
  });

  return producto;
}

async function deactivateProduct(id) {
  const producto = await Producto.findByPk(id);
  if (!producto) return false;

  await producto.update({ activo: false });
  return true;
}

export default {
  list,
  getById,
  createProduct,
  updateProduct,
  deactivateProduct,
};
