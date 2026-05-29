const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

// Ruta para registrar un gato -> POST http://localhost:3000/api/cats
router.post('/', catController.createCat);

// Ruta para listar todos los gatos -> GET http://localhost:3000/api/cats
router.get('/', catController.getAllCats);

// Ruta para actualizar -> PUT http://localhost:3000/api/cats/:id
router.put('/:id', catController.updateCat);

// Ruta para eliminar -> DELETE http://localhost:3000/api/cats/:id
router.delete('/:id', catController.deleteCat);

module.exports = router;