import { renderHeader } from './components/header.js';
import { renderNavbar } from './components/navbar.js';
import { renderProductCard } from './components/card.js';
import { renderFiltros } from './components/filtros.js';
import { animarProductos } from './animations/productos.animations.js';
import { animarMiniCarrito } from './animations/miniCarrito.animations.js';
import { animarHeader } from './animations/header.animations.js';
import { animarFiltros } from './animations/filtros.animations.js';
import { activarParalajeCards } from './animations/paralaje.animations.js';
import { getProductos } from './dbProvisional/productosApi.js';
import { agregarAlCarrito, renderMiniCarritoEnDOM } from './carrito/carrito.js';
import { inicializarTema } from './tema/tema.js';

document.getElementById('header-container').innerHTML =
  renderHeader() + renderNavbar();

inicializarTema();

let productosGlobal = [];

getProductos().then(productos => {
  productosGlobal = productos;
  const categorias = [...new Set(productos.map(p => p.categoria))];
  const tipos = [...new Set(productos.map(p => p.tipo))];
  document.getElementById('filtros-container').innerHTML = renderFiltros(categorias, tipos);
  animarFiltros();
  renderProductos(productos);

  document.querySelectorAll('input[name="categoria"], input[name="tipo"]').forEach(input => {
    input.addEventListener('change', () => {
      const cat = document.querySelector('input[name="categoria"]:checked').value;
      const tipo = document.querySelector('input[name="tipo"]:checked').value;
      let filtrados = productosGlobal;
      if (cat !== 'todas') filtrados = filtrados.filter(p => p.categoria === cat);
      if (tipo !== 'todos') filtrados = filtrados.filter(p => p.tipo === tipo);
      renderProductos(filtrados);
    });
  });
  renderMiniCarritoEnDOM();
  animarMiniCarrito();
  animarHeader();
});

function renderProductos(productos) {
  const container = document.getElementById('productos-container');
  container.innerHTML = `
    <div class="d-flex flex-wrap justify-content-center gap-4">
      ${productos.filter(p => p.activo).map(renderProductCard).join('')}
    </div>`;
  document.querySelectorAll('.btn.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      const producto = productosGlobal.find(p => p.id === id);
      agregarAlCarrito(producto);
    });
  });
  animarProductos();
  activarParalajeCards();
}