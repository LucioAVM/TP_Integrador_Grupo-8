import { renderTicket } from '../components/ticket.js';

export function initTicket() {
  const container = document.getElementById('ticket-container');
  // Lee los datos del último ticket guardado antes de limpiar el carrito
  const ticketData = JSON.parse(localStorage.getItem('ultimo_ticket'));
  if (!ticketData) {
    container.innerHTML = '<p>No hay ticket para mostrar.</p>';
    return;
  }
  const { carrito, total, fecha, nombre_usuario } = ticketData;

  // Puedes formatear la fecha si lo deseas, por ejemplo:
  const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  container.innerHTML = renderTicket(carrito, total, fechaFormateada, nombre_usuario);
}