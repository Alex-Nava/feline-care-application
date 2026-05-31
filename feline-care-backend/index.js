const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');

// 1. Cargar las rutas de la aplicación de forma ordenada
const catRoutes = require('./routes/catRoutes');
const noteRoutes = require('./routes/noteRoutes');
const mealRoutes = require('./routes/mealRoutes');
const litterBoxRoutes = require('./routes/litterBoxRoutes');
const petRoutes = require('./routes/petRoutes'); // 🌟 Importación limpia y explíc.
const authRoutes = require('./routes/authRoutes');

// 2. Importar los modelos físicos para la sincronización de Sequelize
const Cat = require('./models/Cat');
const Meal = require('./models/Meal'); 
const LitterBox = require('./models/LitterBox');
const Pet = require('./models/Pet'); 

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 3. Declaración de Endpoints de la API
app.use('/api/cats', catRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/litterbox', litterBoxRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes); // 🌟 Ahora Express la expone con total seguridad

// Probar la conexión real con PostgreSQL local
async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ ¡Conexión exitosa con la base de datos de PostgreSQL!');
    
    // Sincroniza todos los modelos aplicando alteraciones seguras en las tablas
    await sequelize.sync();
    console.log('🐈 ¡Tablas de la base de datos sincronizadas correctamente con relaciones de Hogar!');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    console.error('💡 Tip: Revisa que tu contraseña en el archivo .env sea la correcta y que Postgres esté activo.');
  }
}

testDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});