import { renderHeader } from './components/header.js';
import { initBienvenida } from './bienvenida/bienvenida.js';
import { initProducto } from './producto/producto.js';
import { initProductoDetalle } from './producto/productoDetail.js';
import { initCarrito } from './carrito/carrito.js';
import { animarHeader } from './animations/header.animations.js';
import { initTicket } from './ticket/ticket.js';
import { inicializarTema } from './tema/tema.js';
import { initEncuesta } from './encuesta/encuesta.js';
import { tieneNombreUsuario, tieneTicket, limpiarSesionCliente } from './utils/session.js';

const path = window.location.pathname;

if (path.endsWith('index.html') || path === '/') {
  limpiarSesionCliente();
}

document.getElementById('header-container').innerHTML = renderHeader(path);

animarHeader();
inicializarTema();

function redirigirSiNoHayNombre() {
  if (!tieneNombreUsuario()) {
    window.location.href = '/';
    return true;
  }
  return false;
}

if (path.endsWith('index.html') || path === '/') {
  initBienvenida();
} else if (path.endsWith('producto.html')) {
  if (!redirigirSiNoHayNombre()) initProducto();
} else if (path.endsWith('producto_detalle.html')) {
  if (!redirigirSiNoHayNombre()) initProductoDetalle();
} else if (path.endsWith('carrito.html')) {
  if (!redirigirSiNoHayNombre()) initCarrito();
} else if (path.endsWith('ticket.html')) {
  if (!tieneTicket()) {
    window.location.href = '/';
  } else {
    initTicket();
  }
} else if (path === '/encuesta' || path.endsWith('/encuesta')) {
  initEncuesta();
}