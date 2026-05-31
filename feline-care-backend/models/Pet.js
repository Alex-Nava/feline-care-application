const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('CAT', 'DOG'),
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE'),
        allowNull: false
    },
    householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'pets',
    timestamps: true
});

module.exports = Pet;