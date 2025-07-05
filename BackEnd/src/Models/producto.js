const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    categoria: String,
    imagen: String
});

module.exports = mongoose.model('Producto', productoSchema);