import Encuesta from '../Models/Encuesta.js';

const getEncuesta = (req, res) => {
  res.render('encuesta', { error: null, activePage: 'encuesta' });
};

const postEncuesta = async (req, res) => {
  try {
    const { puntuacion, comentario } = req.body;
    const imagenPath = req.file ? `/uploads/encuestas/${req.file.filename}` : null;

    await Encuesta.create({
      puntuacion: Number(puntuacion),
      comentario: comentario || '',
      imagen: imagenPath
    });

    // Redirigir a página de gracias
    return res.redirect('/gracias');
  } catch (error) {
    console.error('Error al guardar encuesta:', error);
    return res.render('encuesta', { error: 'Error al enviar la encuesta. Intentá nuevamente.', activePage: 'encuesta' });
  }
};

export default { getEncuesta, postEncuesta };
