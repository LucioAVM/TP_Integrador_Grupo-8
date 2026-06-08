import Encuesta from '../Models/Encuesta.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEncuestaBody({ puntuacion, email, terminos }) {
  const puntaje = Number(puntuacion);
  if (!Number.isFinite(puntaje) || puntaje < 1 || puntaje > 5) {
    return 'La puntuación debe estar entre 1 y 5.';
  }

  const emailVal = String(email || '').trim();
  if (!emailVal) {
    return 'El correo electrónico es obligatorio.';
  }
  if (!EMAIL_REGEX.test(emailVal)) {
    return 'Ingresá un correo electrónico válido.';
  }

  const acepto = terminos === 'on' || terminos === 'true' || terminos === true;
  if (!acepto) {
    return 'Debés aceptar los términos y condiciones.';
  }

  return null;
}

const getEncuesta = (req, res) => {
  res.render('encuesta', { error: null, activePage: 'encuesta' });
};

const postEncuesta = async (req, res) => {
  try {
    const { puntuacion, comentario, email, terminos } = req.body;
    const errorValidacion = validarEncuestaBody({ puntuacion, email, terminos });

    if (errorValidacion) {
      return res.render('encuesta', { error: errorValidacion, activePage: 'encuesta' });
    }

    const imagenPath = req.file ? `/uploads/encuestas/${req.file.filename}` : null;

    await Encuesta.create({
      puntuacion: Number(puntuacion),
      email: email.trim(),
      comentario: comentario || '',
      terminos: true,
      imagen: imagenPath
    });

    return res.redirect('/gracias');
  } catch (error) {
    console.error('Error al guardar encuesta:', error);
    const mensaje = error.message?.includes('Tipo de archivo')
      ? error.message
      : 'Error al enviar la encuesta. Intentá nuevamente.';
    return res.render('encuesta', { error: mensaje, activePage: 'encuesta' });
  }
};

export default { getEncuesta, postEncuesta };
