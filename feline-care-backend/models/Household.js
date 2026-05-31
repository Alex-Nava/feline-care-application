const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Household = sequelize.define('Household', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Mi Hogar Mascotero'
    },
    invite_code: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false
    },
    plan_type: {
        type: DataTypes.ENUM('FREE', 'VIP'),
        defaultValue: 'FREE'
    }
}, {
    tableName: 'households',
    timestamps: true
});

module.exports = Household;