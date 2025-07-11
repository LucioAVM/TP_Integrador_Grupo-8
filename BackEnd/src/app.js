const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const productosRouter = require('./Routes/api/productos.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('Conexión a Azure SQL exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

app.use('/api/productos', productosRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});