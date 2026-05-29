const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const Cat = require('./models/Cat');
const catRoutes = require('./routes/catRoutes');
const cors = require('cors'); // Importar

dotenv.config();

const app = express();
app.use(cors()); // Usar el middleware de CORS
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/cats', catRoutes);

// Probar la conexión real con PostgreSQL local
async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ ¡Conexión exitosa con la base de datos de PostgreSQL!');
    await sequelize.sync({ alter: true }); // <-- 2. Esto crea o actualiza las tablas en Postgres
    console.log('🐈 ¡Tabla de gatos sincronizada correctamente!');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    console.error('💡 Tip: Revisa que tu contraseña en el archivo .env sea la correcta y que Postgres esté activo.');
  }
}

testDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});