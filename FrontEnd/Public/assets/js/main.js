import { renderHeader } from './components/header.js';
import { renderNavbar } from './components/navbar.js';
import { initBienvenida } from './/bienvenida/bienvenida.js';
import { initProducto } from './producto/producto.js';
import { initCarrito } from './carrito/carrito.js';
import { animarHeader } from './animations/header.animations.js';
import { initTicket } from './ticket/ticket.js';

document.getElementById('header-container').innerHTML = renderHeader() + renderNavbar();

animarHeader();

const path = window.location.pathname;

if (path.endsWith('index.html') || path === '/') {
  initBienvenida();
} else if (path.endsWith('producto.html')) {
  initProducto();
} else if (path.endsWith('carrito.html')) {
  initCarrito();
}else if (path.endsWith('ticket.html')) {
  initTicket();
}