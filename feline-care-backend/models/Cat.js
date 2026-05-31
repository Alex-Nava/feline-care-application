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
    allowNull: false, 
    defaultValue: 'Desconocida',
  },
  weight: {
    type: DataTypes.FLOAT, 
    allowNull: true,
  },
  health_status: {
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: 'Sano',
  },
  behavior_notes: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  // CLAVE: Relación con el Hogar 🏠
  householdId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Cambiado a false para obligar a que pertenezca a una casa
    references: {
      model: 'households', // Debe coincidir con el nombre de tu tabla de hogares
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'cats',
  timestamps: true, 
});

module.exports = Cat;