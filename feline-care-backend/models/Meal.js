const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meal = sequelize.define('Meal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    portion_1: { type: DataTypes.BOOLEAN, defaultValue: false },
    portion_2: { type: DataTypes.BOOLEAN, defaultValue: false },
    portion_3: { type: DataTypes.BOOLEAN, defaultValue: false },
    portion_4: { type: DataTypes.BOOLEAN, defaultValue: false },
    
    // Nuevos campos de inspección de agua fresca
    water_check_1: { type: DataTypes.BOOLEAN, defaultValue: false }, // Mañana
    water_check_2: { type: DataTypes.BOOLEAN, defaultValue: false }, // Tarde
    water_check_3: { type: DataTypes.BOOLEAN, defaultValue: false }, // Noche

    served_by: { type: DataTypes.STRING, defaultValue: 'Alex' },
    date_key: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, {
    tableName: 'cat_meals',
    timestamps: true
});

module.exports = Meal;