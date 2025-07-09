import express from 'express';

const app = express();
/*const PORT = 5000;*/

const PORT = process.env.PORT || 8080;

app.use(express.static('FrontEnd/Public'));

app.listen(PORT, () => {
  console.log(`el server esta corriendo en el puerto: ${PORT}`);
});