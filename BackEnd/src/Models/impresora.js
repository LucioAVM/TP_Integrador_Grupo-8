const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Impresora = sequelize.define('Impresora', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: DataTypes.TEXT,
  precio: DataTypes.DECIMAL(10, 2),
  imagen: DataTypes.STRING(255),
  categoria: DataTypes.STRING(50),
  tipo: DataTypes.STRING(10),
  activo: DataTypes.BOOLEAN
}, {
  tableName: 'impresoras',
  timestamps: false
});

module.exports = Impresora;