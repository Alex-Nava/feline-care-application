const express = require('express');
const router = express.Router();
const sequelize = require('../config/database'); 

// Obtener notas compartidas
router.get('/', async (req, res) => {
  try {
    let householdId = req.query.householdId || req.headers['household-id'];
    
    if (!householdId || householdId === 'undefined' || householdId === 'null') {
      return res.json([]);
    }

    let cleanIdStr = String(householdId).replace(/:/g, '').trim();
    const cleanHouseholdId = parseInt(cleanIdStr, 10);
    
    if (isNaN(cleanHouseholdId)) {
      return res.json([]);
    }

    // Query directa a la columna nativa recién creada
    const [notes] = await sequelize.query(
      'SELECT * FROM home_notes WHERE "householdId" = :id ORDER BY id DESC LIMIT 50',
      { replacements: { id: cleanHouseholdId }, type: sequelize.QueryTypes.SELECT }
    );
    return res.json(notes);

  } catch (error) {
    console.error("❌ Error en GET /api/notes:", error.message);
    return res.json([]); 
  }
});

// Crear nota compartida
router.post('/', async (req, res) => {
  try {
    const { user_name, content, category, householdId } = req.body;
    if (!user_name || !content) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    
    let cleanIdStr = String(householdId || '1').replace(/:/g, '').trim();
    const cleanHouseholdId = parseInt(cleanIdStr, 10);
    const validId = isNaN(cleanHouseholdId) ? 1 : cleanHouseholdId;
    
    const [results] = await sequelize.query(
      'INSERT INTO home_notes (user_name, content, category, "householdId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      { bind: [user_name, content, category || 'general', validId] }
    );
    
    return res.json(results[0]);
  } catch (err) {
    console.error("❌ Error en POST /api/notes:", err.message);
    res.status(500).send('Error en el servidor al crear la nota');
  }
});

module.exports = router;