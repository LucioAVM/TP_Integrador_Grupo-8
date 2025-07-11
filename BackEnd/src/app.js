const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const productosRouter = require('./Routes/api/productos.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para parsear JSON
app.use(express.json());

// Probar conexión a la base de datos al iniciar
sequelize.authenticate()
  .then(() => console.log('Conexión a Azure SQL exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

// Rutas de la API
app.use('/api/productos', productosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});