import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Venta = sequelize.define('Venta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_usuario: { type: DataTypes.STRING, allowNull: false },
  fecha: { type: DataTypes.DATE }, 
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, {
  tableName: 'ventas',
  timestamps: false
});

export default Venta;