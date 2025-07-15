import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Venta = sequelize.define('Venta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_usuario: { type: DataTypes.STRING(100), allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'ventas',
  timestamps: false, // Desactiva el manejo automático de fechas por Sequelize
});

export default Venta;