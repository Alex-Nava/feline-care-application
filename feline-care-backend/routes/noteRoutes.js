const express = require('express');
const router = express.Router();
const sequelize = require('../config/database'); // Tu conexión de Sequelize

// 1. Obtener todas las notas de la casa
router.get('/', async (req, res) => {
    try {
        // Usamos query nativo pero a través del método oficial de Sequelize
        const [results] = await sequelize.query('SELECT * FROM home_notes ORDER BY created_at DESC');
        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor al obtener notas');
    }
});

// 2. Crear una nueva nota compartida
router.post('/', async (req, res) => {
    try {
        const { user_name, content, category } = req.body;

        // Validamos que los datos no lleguen vacíos
        if (!user_name || !content) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        
        // En Sequelize, los parámetros se pasan usando la opción 'replacements' o un objeto de configuración
        const [results] = await sequelize.query(
            'INSERT INTO home_notes (user_name, content, category) VALUES ($1, $2, $3) RETURNING *',
            {
                bind: [user_name, content, category || 'general']
            }
        );
        
        // RETURNING * devuelve un array con la fila insertada en la primera posición
        res.json(results[0]);
    } catch (err) {
        console.error("Error detallado:", err.message);
        res.status(500).send('Error en el servidor al crear la nota');
    }
});

module.exports = router;