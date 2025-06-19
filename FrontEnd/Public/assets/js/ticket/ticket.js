import { renderTicket } from '../components/ticket.js';

export function initTicket() {
  const container = document.getElementById('ticket-container');
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Ajusta aquí el nombre de la clave según cómo guardes el carrito
  const cart = JSON.parse(localStorage.getItem('carrito')) || [];
  let total = 0;
  cart.forEach(item => {
    total += (item.price || item.precio) * (item.quantity || item.cantidad || 1);
  });

  container.innerHTML = renderTicket(cart, total, fecha);
}