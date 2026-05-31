const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// 1. REGISTRAR MASCOTA: Guarda un perro o gato amarrado al hogar
router.post('/add', async (req, res) => {
    try {
        const { name, type, gender, householdId } = req.body;

        // Validaciones básicas de supervivencia de datos
        if (!name || !type || !gender || !householdId) {
            return res.status(400).json({ msg: 'Por favor, completa todos los campos de la mascota.' });
        }

        // Crear registro en la base de datos
        const newPet = await Pet.create({
            name,
            type: type.toUpperCase(), // 'CAT' o 'DOG'
            gender: gender.toUpperCase(), // 'MALE' o 'FEMALE'
            householdId
        });

        res.json({ msg: '¡Mascota registrada con éxito! 🐾', pet: newPet });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al registrar la mascota');
    }
});

// 2. OBTENER MASCOTAS DEL HOGAR: Lista todos los animales de la casa
router.get('/household/:householdId', async (req, res) => {
    try {
        const { householdId } = req.params;
        const pets = await Pet.findAll({ where: { householdId } });
        res.json(pets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al obtener las mascotas del hogar');
    }
});

module.exports = router;