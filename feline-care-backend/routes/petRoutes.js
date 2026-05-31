const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// 1. OBTENER MASCOTAS POR HOGAR
router.get('/household/:householdId', async (req, res) => {
  try {
    let { householdId } = req.params;

    // Limpieza por si arrastra caracteres raros
    if (typeof householdId === 'string' && householdId.includes(':')) {
      householdId = householdId.replace(/:/g, '');
    }

    const cleanHouseholdId = parseInt(householdId, 10);
    if (isNaN(cleanHouseholdId)) {
      return res.status(400).json({ msg: "ID de hogar inválido." });
    }

    // 🎯 QUERY EXACTA: Tabla 'pets' en minúsculas, columna 'householdId' en camelCase con comillas dobles
    const [pets] = await sequelize.query(
      'SELECT * FROM pets WHERE "householdId" = $1 ORDER BY id ASC',
      { bind: [cleanHouseholdId] }
    );

    return res.json(pets);

  } catch (error) {
    console.error("❌ Error en GET /api/pets/household/:", error.message);
    return res.status(500).json({ msg: "Error al consultar las mascotas." });
  }
});

// 2. AÑADIR NUEVA MASCOTA
router.post('/add', async (req, res) => {
  try {
    const { name, type, gender, householdId } = req.body;

    if (!name || !householdId) {
      return res.status(400).json({ msg: "Faltan campos obligatorios." });
    }

    const cleanHouseholdId = parseInt(householdId, 10);
    const cleanType = String(type).toUpperCase(); 
    const cleanGender = String(gender).toUpperCase(); 

    // 🎯 INSERT EXACTO: Tabla 'pets' y columna '"householdId"'
    const [result] = await sequelize.query(
      'INSERT INTO pets (name, type, gender, "householdId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      { bind: [name, cleanType, cleanGender, cleanHouseholdId] }
    );

    return res.status(201).json({ msg: "¡Mascota añadida con éxito! 👑", data: result[0] });

  } catch (error) {
    console.error("❌ Error crítico al añadir mascota:", error.message);
    return res.status(500).json({ msg: "Error interno al guardar la mascota." });
  }
});

module.exports = router;