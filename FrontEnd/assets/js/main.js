import { renderHeader } from './components/header.js';
import { renderNavbar } from './components/navbar.js';
import { renderProductCard } from './components/card.js';
import { renderFiltros } from './components/filtros.js';
import { renderMiniCarrito } from './components/miniCarrito.js';
import { animarProductos, animarMiniCarrito, animarCambioModo, animarHeader, animarFiltros, activarParalajeCards } from './animations.js';

document.getElementById('header-container').innerHTML =
  renderHeader() + renderNavbar();

let productosGlobal = [];
let carrito = [];

fetch('FrontEnd/assets/data/productos.json')
  .then(response => response.json())
  .then(productos => {
    productosGlobal = productos;
    const categorias = [...new Set(productos.map(p => p.categoria))];
    const tipos = [...new Set(productos.map(p => p.tipo))];
    document.getElementById('filtros-container').innerHTML = renderFiltros(categorias, tipos);
    animarFiltros(); // Animar filtros al renderizarlos
    renderProductos(productos);

    // Escuchar cambios en los filtros
    document.querySelectorAll('input[name="categoria"], input[name="tipo"]').forEach(input => {
      input.addEventListener('change', () => {
        const cat = document.querySelector('input[name="categoria"]:checked').value;
        const tipo = document.querySelector('input[name="tipo"]:checked').value;
        let filtrados = productosGlobal;
        if (cat !== 'todas') {
          filtrados = filtrados.filter(p => p.categoria === cat);
        }
        if (tipo !== 'todos') {
          filtrados = filtrados.filter(p => p.tipo === tipo);
        }
        renderProductos(filtrados);
      });
    });
    renderMiniCarritoEnDOM();
    animarMiniCarrito(); // Solo aquí, al inicio
    animarHeader();
  });

function renderProductos(productos) {
  const container = document.getElementById('productos-container');
  container.innerHTML = `
    <div class="d-flex flex-wrap justify-content-center gap-4">
      ${productos
        .filter(p => p.activo)
        .map(renderProductCard)
        .join('')}
    </div>`;

  // Evento para agregar al carrito usando data-id
  document.querySelectorAll('.btn.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      const producto = productosGlobal.find(p => p.id === id);
      const existe = carrito.find(item => item.id === id);
      if (existe) {
        existe.cantidad += 1;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
      renderMiniCarritoEnDOM();
    });
  });
  animarProductos();
  activarParalajeCards();
}

function renderMiniCarritoEnDOM() {
  document.getElementById('mini-carrito-container').innerHTML = renderMiniCarrito(carrito);
}

// Modo claro/oscuro y cambio de ícono
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btn = document.getElementById('toggle-theme-btn');
  function actualizarIconoTema() {
    if (body.classList.contains('bg-light')) {
      btn.textContent = '☀️';
    } else {
      btn.textContent = '🌙';
    }
  }
  // Cargar preferencia guardada
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
    // Guardar preferencia
    if (body.classList.contains('bg-light')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });
});