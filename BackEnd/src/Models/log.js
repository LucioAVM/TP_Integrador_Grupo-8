import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const Log = sequelize.define('Log', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    adminId: { type: DataTypes.INTEGER, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    mensaje: { type: DataTypes.TEXT, allowNull: true },
    // Not managed by Sequelize; DB will set createdAt via GETDATE()
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('GETDATE()') },
}, {
    tableName: 'logs',
    // Disable Sequelize automatic timestamps to avoid it sending its own formatted dates
    timestamps: false,
    updatedAt: false,
});

export default Log;