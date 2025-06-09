import express from 'express';

const app = express();
const PORT = 5000;

app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});