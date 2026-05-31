const express = require('express');
const router = express.Router();
const LitterBox = require('../models/LitterBox');

// 1. Obtener estado del arenero (Con reinicio automático al cambiar de día)
router.get('/', async (req, res) => {
    try {
        let box = await LitterBox.findByPk(1);
        if (!box) {
            box = await LitterBox.create({ id: 1, uses_litterbox: false });
        }
        
        // Si cambió el día, reiniciamos los checks diarios
        const todayStr = new Date().toISOString().split('T')[0];
        if (box.last_daily_clean !== todayStr) {
            box.cleaned_morning = false;
            box.cleaned_evening = false;
            box.last_daily_clean = todayStr;
            await box.save();
        }

        res.json(box);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener datos del arenero');
    }
});

// 2. Setup inicial
router.post('/setup', async (req, res) => {
    try {
        const { uses_litterbox, sand_type } = req.body;
        let box = await LitterBox.findByPk(1);
        if (!box) box = await LitterBox.create({ id: 1 });

        box.uses_litterbox = uses_litterbox;
        box.sand_type = uses_litterbox ? sand_type : null;
        if (uses_litterbox) {
            box.last_full_change = new Date().toISOString().split('T')[0];
        }
        await box.save();
        res.json(box);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en setup');
    }
});

// 3. Registrar limpieza controlada por ventanas de tiempo
router.post('/clean', async (req, res) => {
    try {
        const box = await LitterBox.findByPk(1);
        if (!box || !box.uses_litterbox) {
            return res.status(400).send('El arenero no está activo');
        }

        const currentHour = new Date().getHours();
        let shiftUpdated = null;

        // Ventana Mañana: 06:00 AM a 02:00 PM (Hora 6 a 13)
        if (currentHour >= 6 && currentHour < 14) {
            if (box.cleaned_morning) return res.status(400).send('Ya limpiaste el turno de la mañana');
            box.cleaned_morning = true;
            shiftUpdated = 'mañana';
        } 
        // Ventana Noche: 06:00 PM a 11:59 PM (Hora 18 a 23)
        else if (currentHour >= 18 && currentHour < 24) {
            if (box.cleaned_evening) return res.status(400).send('Ya limpiaste el turno de la noche');
            box.cleaned_evening = true;
            shiftUpdated = 'noche';
        } 
        else {
            return res.status(400).send('No estás dentro de ninguna ventana de limpieza autorizada. ¡Aún no toca!');
        }

        box.last_daily_clean = new Date().toISOString().split('T')[0];
        await box.save();
        res.json({ box, shiftUpdated });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al procesar la limpieza');
    }
});

// 4. Reinicio de batería
router.post('/reset-battery', async (req, res) => {
    try {
        const box = await LitterBox.findByPk(1);
        if (box && box.uses_litterbox) {
            box.last_full_change = new Date().toISOString().split('T')[0];
            await box.save();
            return res.json(box);
        }
        res.status(400).send('Arenero inactivo');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al reiniciar la batería');
    }
});

module.exports = router;