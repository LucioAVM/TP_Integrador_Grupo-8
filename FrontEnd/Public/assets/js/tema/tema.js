import { animarCambioModo } from '../animations/tema.animations.js';

export function inicializarTema() {
  const body = document.body;
  const btn = document.getElementById('toggle-theme-btn');
  if (!btn) return; // si no hay botón en la página, salir

  function aplicarTema(theme) {
    body.classList.remove('bg-dark', 'bg-light');
    body.classList.add(theme === 'light' ? 'bg-light' : 'bg-dark');
    localStorage.setItem('theme', theme);
  }

  function actualizarIconoTema() {
    if (!btn) return;
    btn.textContent = body.classList.contains('bg-light') ? '☀️' : '🌙';
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    aplicarTema(savedTheme);
  } else if (body.classList.contains('bg-dark')) {
    aplicarTema('dark');
  } else {
    // Si no hay preferencia guardada ni clase inicial, se usa claro por defecto
    aplicarTema('light');
  }

  actualizarIconoTema();

  btn.addEventListener('click', () => {
    const nextTheme = body.classList.contains('bg-light') ? 'dark' : 'light';
    aplicarTema(nextTheme);
    actualizarIconoTema();
    animarCambioModo();
  });
}