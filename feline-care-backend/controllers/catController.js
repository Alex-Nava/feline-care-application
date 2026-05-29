const Cat = require('../models/Cat');

// 1. Registrar un nuevo felino
exports.createCat = async (req, res) => {
  try {
    const { name, age, breed } = req.body;

    // Validación simple
    if (!name || !age || !breed) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre, la edad y la raza son obligatorios' 
      });
    }

    // Opción más segura: guardas solo lo que esperas recibir
const newCat = await Cat.create({
  name,
  age,
  breed,
  weight: req.body.weight,
  health_status: req.body.health_status,
  behavior_notes: req.body.behavior_notes
});
    res.status(201).json({ success: true, message: '🐈 ¡Gatito registrado con éxito!', data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Obtener todos los felinos registrados
exports.getAllCats = async (req, res) => {
  try {
    const cats = await Cat.findAll();
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