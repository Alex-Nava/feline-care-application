const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cat = sequelize.define('Cat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false, // Cámbialo a false si quieres que sea obligatorio
    defaultValue: 'Desconocida',
  },
  weight: {
    type: DataTypes.FLOAT, // Para llevar control exacto en kilos
    allowNull: true,
  },
  health_status: {
    type: DataTypes.STRING, // Ejemplo: "En recuperación", "Post-operatorio", "Sano"
    allowNull: true,
    defaultValue: 'Sano',
  },
  behavior_notes: {
    type: DataTypes.TEXT, // Para registrar conductas (ej. temas territoriales, socialización)
    allowNull: true,
  }
}, {
  tableName: 'cats',
  timestamps: true, // Nos crea automáticamente createdAt y updatedAt (ideal para historial médico)
});

module.exports = Cat;