import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Impresora = sequelize.define('Impresora', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'impresoras',
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'impresoras',
  timestamps: false,
});

export default Impresora;