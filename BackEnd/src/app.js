const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/impresoras', require('./routes/impresorasRoutes'));
app.use('/api/insumos', require('./routes/insumosRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// Base de datos
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'fenrir_3d';

// JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';

const productosRouter = require('./routes/productos');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/dashboard/productos', productosRouter);