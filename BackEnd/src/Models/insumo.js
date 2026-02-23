import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Asegúrate de que esta ruta sea correcta

const Insumo = sequelize.define('Insumo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
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
  imagen: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser null si no se sube una imagen
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'insumos',
  },
}, {
  tableName: 'insumos', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva createdAt y updatedAt si no los necesitas
});

export default Insumo;