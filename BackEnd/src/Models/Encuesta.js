import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Encuesta = sequelize.define('Encuesta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  puntuacion: { type: DataTypes.INTEGER, allowNull: false },
  comentario: { type: DataTypes.TEXT, allowNull: true },
  imagen: { type: DataTypes.STRING, allowNull: true },
  fecha: { 
    type: DataTypes.DATE, 
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'encuestas',
  timestamps: false,
});

export default Encuesta;
