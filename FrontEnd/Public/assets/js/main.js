import { renderHeader } from './components/header.js';
import { renderNavbar } from './components/navbar.js';
import { initBienvenida } from './/bienvenida/bienvenida.js';
import { initProducto } from './producto/producto.js';
import { initCarrito } from './carrito/carrito.js';
// ...otros módulos

// Renderiza header y navbar en todas las páginas
document.getElementById('header-container').innerHTML =
  renderHeader() + renderNavbar();

const path = window.location.pathname;

if (path.endsWith('index.html') || path === '/') {
  initBienvenida();
} else if (path.endsWith('producto.html')) {
  initProducto();
} else if (path.endsWith('carrito.html')) {
  initCarrito();
}