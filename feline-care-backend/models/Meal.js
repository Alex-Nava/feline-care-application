const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meal = sequelize.define('Meal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    portion_type: {
        type: DataTypes.STRING,
        allowNull: false // Aquí se guardará 'Desayuno', 'Almuerzo', 'Cena' o 'Agua'
    },
    water_ml: {
        type: DataTypes.INTEGER,
        defaultValue: 0 // Para cuando solo registren agua
    },
    served_by: {
        type: DataTypes.STRING,
        defaultValue: 'Alex' // Quién de la casa sirvió la porción
    },
    date_key: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW // Guarda la fecha limpia (AAAA-MM-DD) para agrupar las comidas por día
    }
}, {
    tableName: 'cat_meals',
    timestamps: true // Esto crea automáticamente "createdAt" con la hora exacta del clic
});

module.exports = Meal;