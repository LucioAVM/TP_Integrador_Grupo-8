import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VentaProducto = sequelize.define('VentaProducto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  venta_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'venta_productos',
  timestamps: false,
});

export default VentaProducto;