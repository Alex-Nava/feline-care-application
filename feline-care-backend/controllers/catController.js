const Cat = require('../models/Cat');

// 1. Registrar un nuevo felino amarrado a su hogar
exports.createCat = async (req, res) => {
  try {
    // Recibimos el householdId desde el cuerpo de la petición
    const { name, age, breed, householdId } = req.body;

    // Validación estricta: si no hay ID de hogar, frenamos el guardado
    if (!name || !age || !breed || !householdId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor, completa todos los campos de la mascota (incluyendo el Hogar).' 
      });
    }

    // Guardamos la mascota inyectándole su respectivo hogar
    const newCat = await Cat.create({
      name,
      age: parseInt(age),
      breed,
      householdId: parseInt(householdId), // <-- Guardamos la relación
      weight: req.body.weight,
      health_status: req.body.health_status,
      behavior_notes: req.body.behavior_notes
    });

    res.status(201).json({ success: true, message: '🐈 ¡Gatito registrado con éxito!', data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Obtener SOLO los felinos del hogar activo (Filtrado Inteligente 🎯)
exports.getAllCats = async (req, res) => {
  try {
    // Leemos el householdId que viaja como parámetro en la URL (?householdId=1) o por headers
    const householdId = req.query.householdId || req.headers['household-id'];

    if (!householdId) {
      return res.status(400).json({ success: false, message: 'Falta el parámetro householdId para filtrar.' });
    }

    // Filtramos usando el WHERE de Sequelize para aislar los datos de la casa
    const cats = await Cat.findAll({
      where: { householdId: parseInt(householdId) }
    });

    res.status(200).json({
      success: true,
      data: cats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de gatitos',
      error: error.message
    });
  }
};

// 3. Actualizar un felino
exports.updateCat = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Cat.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Gatito no encontrado' });
    res.status(200).json({ success: true, message: '¡Datos del gatito actualizados!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Eliminar un felino
exports.deleteCat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cat.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Gatito no encontrado' });
    res.status(200).json({ success: true, message: '¡Registro del gatito eliminado!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};