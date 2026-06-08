import { fenrirSwal } from '../utils/fenrirSwal.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = mensaje || '';
  el.classList.toggle('d-none', !mensaje);
}

function marcarCampo(input, invalido) {
  if (!input) return;
  input.classList.toggle('is-invalid', invalido);
}

export function initEncuesta() {
  const form = document.getElementById('form-encuesta');
  if (!form) return;

  const puntuacion = document.getElementById('puntuacion');
  const puntuacionValor = document.getElementById('puntuacion-valor');
  const email = document.getElementById('email');
  const imagen = document.getElementById('imagen');
  const terminos = document.getElementById('terminos');

  if (puntuacion && puntuacionValor) {
    const actualizarPuntuacion = () => {
      puntuacionValor.textContent = puntuacion.value;
    };
    actualizarPuntuacion();
    puntuacion.addEventListener('input', actualizarPuntuacion);
  }

  [email, imagen, terminos, puntuacion].forEach((input) => {
    input?.addEventListener('input', () => validarEncuesta(form));
    input?.addEventListener('change', () => validarEncuesta(form));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarEncuesta(form)) return;

    await fenrirSwal.fire({
      title: '¡Gracias!',
      text: 'Tu feedback fue recibido. ¡Gracias por ayudarnos a mejorar!',
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
    });

    form.submit();
  });
}

function validarEncuesta(form) {
  let valido = true;
  const puntuacion = form.querySelector('#puntuacion');
  const email = form.querySelector('#email');
  const imagen = form.querySelector('#imagen');
  const terminos = form.querySelector('#terminos');

  const puntaje = Number(puntuacion?.value);
  if (!Number.isFinite(puntaje) || puntaje < 1 || puntaje > 5) {
    mostrarError('error-puntuacion', 'Seleccioná una puntuación entre 1 y 5.');
    marcarCampo(puntuacion, true);
    valido = false;
  } else {
    mostrarError('error-puntuacion', '');
    marcarCampo(puntuacion, false);
  }

  const emailVal = email?.value?.trim() || '';
  if (!emailVal) {
    mostrarError('error-email', 'El correo electrónico es obligatorio.');
    marcarCampo(email, true);
    valido = false;
  } else if (!EMAIL_REGEX.test(emailVal)) {
    mostrarError('error-email', 'Ingresá un correo válido (ejemplo: nombre@dominio.com).');
    marcarCampo(email, true);
    valido = false;
  } else {
    mostrarError('error-email', '');
    marcarCampo(email, false);
  }

  const file = imagen?.files?.[0];
  if (file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      mostrarError('error-imagen', 'Solo se permiten imágenes JPG, PNG o WEBP.');
      marcarCampo(imagen, true);
      valido = false;
    } else if (file.size > MAX_FILE_SIZE) {
      mostrarError('error-imagen', 'La imagen no puede superar los 5 MB.');
      marcarCampo(imagen, true);
      valido = false;
    } else {
      mostrarError('error-imagen', '');
      marcarCampo(imagen, false);
    }
  } else {
    mostrarError('error-imagen', '');
    marcarCampo(imagen, false);
  }

  if (!terminos?.checked) {
    mostrarError('error-terminos', 'Debés aceptar los términos y condiciones.');
    marcarCampo(terminos, true);
    valido = false;
  } else {
    mostrarError('error-terminos', '');
    marcarCampo(terminos, false);
  }

  return valido;
}
