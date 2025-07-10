import express from 'express';
import 'dotenv/config';
import { getProductos } from './BackEnd/src/config/db.js'; // Importa desde la carpeta backend

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('FrontEnd/Public'));

// Endpoint para obtener productos desde la base de datos
app.get('/api/productos', async (req, res) => {
  const productos = await getProductos();
  res.json(productos);
});

app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});