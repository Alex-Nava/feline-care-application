const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const cors = require('cors'); // Importar

// 1. Cargamos SOLO los modelos que realmente existen físicamente en tu carpeta /models
const Cat = require('./models/Cat');
const Meal = require('./models/Meal'); // <-- Esta se queda porque sí existe

const catRoutes = require('./routes/catRoutes');
const noteRoutes = require('./routes/noteRoutes');
const mealRoutes = require('./routes/mealRoutes');

dotenv.config();

const app = express();
app.use(cors()); // Usar el middleware de CORS
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/cats', catRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/meals', mealRoutes);

// Probar la conexión real con PostgreSQL local
async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ ¡Conexión exitosa con la base de datos de PostgreSQL!');
    
    // Sincroniza Cat y Meal a Postgres
    await sequelize.sync({ alter: true }); 
    console.log('🐈 ¡Tablas de la base de datos sincronizadas correctamente!');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    console.error('💡 Tip: Revisa que tu contraseña en el archivo .env sea la correcta y que Postgres esté activo.');
  }
}

testDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});