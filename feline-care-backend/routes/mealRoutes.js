const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

// 1. Obtener datos de hoy (El cliente le dice al backend qué fecha es en su país)
router.post('/today', async (req, res) => {
    try {
        const { clientDate } = req.body; // Recibe "YYYY-MM-DD" del celular
        if (!clientDate) return res.status(400).send('Falta la fecha del cliente');

        let meal = await Meal.findOne({ where: { date_key: clientDate } });
        if (!meal) {
            meal = await Meal.create({ date_key: clientDate });
        }
        res.json(meal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener control diario');
    }
});

// 2. Servir Porción de Comida validando la hora enviada por el celular
router.post('/serve-portion', async (req, res) => {
    try {
        const { clientDate, clientHour } = req.body;
        if (!clientDate || clientHour === undefined) return res.status(400).send('Datos de tiempo insuficientes');

        let meal = await Meal.findOne({ where: { date_key: clientDate } });
        if (!meal) meal = await Meal.create({ date_key: clientDate });

        // Evaluamos según el reloj real del celular del usuario
        if (clientHour >= 6 && clientHour < 9) {
            if (meal.portion_1) return res.status(400).send('Porción 1 ya servida');
            meal.portion_1 = true;
        } else if (clientHour >= 11 && clientHour < 14) {
            if (meal.portion_2) return res.status(400).send('Porción 2 ya servida');
            meal.portion_2 = true;
        } else if (clientHour >= 16 && clientHour < 19) {
            if (meal.portion_3) return res.status(400).send('Porción 3 ya servida');
            meal.portion_3 = true;
        } else if (clientHour >= 21 && clientHour < 24) {
            if (meal.portion_4) return res.status(400).send('Porción 4 ya servida');
            meal.portion_4 = true;
        } else {
            return res.status(400).send('No hay ninguna ventana de alimentación activa en este momento.');
        }

        await meal.save();
        res.json(meal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en comida');
    }
});

// 3. Registrar Inspección de Agua Inteligente
router.post('/check-water', async (req, res) => {
    try {
        const { clientDate, clientHour } = req.body;
        if (!clientDate || clientHour === undefined) return res.status(400).send('Datos de tiempo insuficientes');

        let meal = await Meal.findOne({ where: { date_key: clientDate } });
        if (!meal) meal = await Meal.create({ date_key: clientDate });

        if (clientHour >= 6 && clientHour < 12) {
            if (meal.water_check_1) return res.status(400).send('Inspección de mañana ya realizada');
            meal.water_check_1 = true;
        } else if (clientHour >= 13 && clientHour < 19) {
            if (meal.water_check_2) return res.status(400).send('Inspección de la tarde ya realizada');
            meal.water_check_2 = true;
        } else if (clientHour >= 20 && clientHour < 24) {
            if (meal.water_check_3) return res.status(400).send('Inspección nocturna ya realizada');
            meal.water_check_3 = true;
        } else {
            return res.status(400).send('No estás en un bloque de inspección obligatoria de agua.');
        }

        await meal.save();
        res.json(meal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al verificar agua');
    }
});

module.exports = router;