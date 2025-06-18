import { renderBienvenidaForm } from '../components/bienvenidaForm.js';
import { animarBienvenida } from '../animations/animarBienvenida.js';

export function initBienvenida() {
  document.getElementById('bienvenida-container').innerHTML = renderBienvenidaForm();

  document.getElementById('form-bienvenida').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre) {
      localStorage.setItem('nombreCliente', nombre);
      window.location.href = 'producto.html';
    }
  });

  animarBienvenida();
}