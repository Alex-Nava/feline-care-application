const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: { // Guarda si es 'Gato' o 'Perro' según el frontend
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: { // Guarda 'Machito' o 'Hembrita'
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 🏠 LA LLAVE MAESTRA: Relación con la tabla de hogares
  householdId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'households', // Debe coincidir con el nombre físico de tu tabla de hogares
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'pets',
  timestamps: true, // Nos crea createdAt y updatedAt automáticamente
});

module.exports = Pet;