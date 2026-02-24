import { animarCambioModo } from '../animations/tema.animations.js';

export function inicializarTema() {
  const body = document.body;
  const btn = document.getElementById('toggle-theme-btn');
  if (!btn) return; // si no hay botón en la página, salir
  function actualizarIconoTema() {
    if (!btn) return;
    btn.textContent = body.classList.contains('bg-light') ? '☀️' : '🌙';
  }
  if (localStorage.getItem('theme') === 'light') {
    body.classList.remove('bg-dark');
    body.classList.add('bg-light');
  }
  actualizarIconoTema();
  btn.addEventListener('click', () => {
    body.classList.toggle('bg-dark');
    body.classList.toggle('bg-light');
    actualizarIconoTema();
    animarCambioModo();
    localStorage.setItem('theme', body.classList.contains('bg-light') ? 'light' : 'dark');
  });
}