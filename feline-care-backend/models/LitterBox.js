const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LitterBox = sequelize.define('LitterBox', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uses_litterbox: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sand_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_full_change: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    // Nuevos campos para controlar las ventanas estrictas de hoy
    cleaned_morning: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    cleaned_evening: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    last_daily_clean: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'cat_litterbox',
    timestamps: true
});

module.exports = LitterBox;