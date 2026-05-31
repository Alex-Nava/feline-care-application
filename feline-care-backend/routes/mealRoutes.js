const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// 1. Obtener las comidas registradas HOY 
router.get('/today', async (req, res) => {
    try {
        const [results] = await sequelize.query(
            'SELECT * FROM cat_meals WHERE date_key = CURRENT_DATE ORDER BY "createdAt" DESC'
        );
        res.json(results);
    } catch (err) {
        console.error("Error en GET /today:", err.message);
        res.status(500).send('Error al obtener las comidas de hoy');
    }
});

// 2. Registrar una nueva porción o toma de agua
router.post('/', async (req, res) => {
    try {
        const { portion_type, water_ml, served_by } = req.body;

        const [results] = await sequelize.query(
            `INSERT INTO cat_meals (portion_type, water_ml, served_by, date_key, "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, CURRENT_DATE, NOW(), NOW()) RETURNING *`,
            {
                bind: [portion_type, water_ml || 0, served_by || 'Alex']
            }
        );
        res.json(results[0]);
    } catch (err) {
        console.error("Error en POST /meals:", err.message);
        res.status(500).send('Error al registrar la comida');
    }
});

module.exports = router;