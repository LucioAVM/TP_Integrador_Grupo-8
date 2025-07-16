import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VistaProductos = sequelize.define('VistaProductos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
  },
  categoria: {
    type: DataTypes.STRING,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  tipo_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'vista_productos',
  timestamps: false,
});

export default VistaProductos;