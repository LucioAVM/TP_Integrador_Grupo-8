import express from 'express';
import 'dotenv/config';
import { getProductos } from './BackEnd/src/config/db.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('FrontEnd/Public'));

// Endpoint para obtener productos desde la base de datos
app.get('/api/productos', async (req, res) => {
  console.log('Handler /api/productos ejecutado');
  try {
    console.log('Consultando productos...');
    const productos = await getProductos();
    console.log('Productos obtenidos:', productos);
    res.json(productos);
  } catch (err) {
    console.error('Error al consultar productos:', err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});