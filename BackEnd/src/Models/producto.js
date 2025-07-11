const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según tu estructura

const Producto = sequelize.define('Producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  categoria: {
    type: DataTypes.STRING
  },
  imagen: {
    type: DataTypes.STRING
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'productos',
  timestamps: false
});

module.exports = Producto;