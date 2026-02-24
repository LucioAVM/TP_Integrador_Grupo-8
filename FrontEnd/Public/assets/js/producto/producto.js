import { renderProductCard } from '../components/card.js';
import { renderFiltros } from '../components/filtros.js';
import { animarProductos } from '../animations/productos.animations.js';
import { animarMiniCarrito } from '../animations/miniCarrito.animations.js';
import { animarHeader } from '../animations/header.animations.js';
import { animarFiltros } from '../animations/filtros.animations.js';
import { activarParalajeCards } from '../animations/paralaje.animations.js';
import { getProductos, getFiltros } from '../api/productosApi.js';
import { agregarAlCarrito, renderMiniCarritoEnDOM } from '../carrito/carrito.js';

let productosGlobal = [];
let currentPage = 1;
let currentLimit = 6;
let totalPages = 1;

export function initProducto() {
  // Cargar filtros universales y la primera página
  getFiltros().then(({ categorias, tipos }) => {
    const filtrosContainer = document.getElementById('filtros-container');
    if (filtrosContainer) filtrosContainer.innerHTML = renderFiltros(categorias, tipos);
    animarFiltros();
    // listeners que recargan la página 1 con los filtros seleccionados
    document.querySelectorAll('input[name="categoria"], input[name="tipo"]').forEach(input => {
      input.addEventListener('change', () => loadPage(1));
    });
  }).catch(err => {
    console.error('Error al cargar filtros:', err);
  }).finally(() => loadPage(1));
}

async function loadPage(page = 1) {
  try {
    // leer filtros seleccionados en la UI
    const catEl = document.querySelector('input[name="categoria"]:checked');
    const tipoEl = document.querySelector('input[name="tipo"]:checked');
    const categoria = catEl && catEl.value !== 'todas' ? catEl.value : null;
    const tipo = tipoEl && tipoEl.value !== 'todos' ? tipoEl.value : null;

    const data = await getProductos({ page, limit: currentLimit, categoria, tipo });
    const productos = data && Array.isArray(data.products) ? data.products : [];
    if (!Array.isArray(data.products)) console.warn('API /api/productos devolvió products no-array:', data);
    productosGlobal = productos;
    currentPage = data.page || page;
    totalPages = data.totalPages || 1;

    renderProductos(productos);
    renderPagination();

    renderMiniCarritoEnDOM();
    animarMiniCarrito();
    animarHeader();
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

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
      if (!producto) {
        return;
      }
      agregarAlCarrito(producto);
    });
  });
  animarProductos();
  activarParalajeCards();
}

function renderPagination() {
  const container = document.getElementById('productos-container');
  if (!container) return;
  // asegurarse de que exista el contenedor de paginación
  let pagDiv = document.getElementById('productos-pagination');
  if (!pagDiv) {
    pagDiv = document.createElement('div');
    pagDiv.id = 'productos-pagination';
    pagDiv.className = 'd-flex justify-content-center align-items-center mt-3 gap-2';
    container.insertAdjacentElement('afterend', pagDiv);
  }
  pagDiv.innerHTML = `
    <button class="btn btn-sm btn-outline-primary" id="pag-prev" ${currentPage <= 1 ? 'disabled' : ''}>Anterior</button>
    <span class="mx-2">Página ${currentPage} de ${totalPages}</span>
    <button class="btn btn-sm btn-outline-primary" id="pag-next" ${currentPage >= totalPages ? 'disabled' : ''}>Siguiente</button>
  `;

  document.getElementById('pag-prev').addEventListener('click', () => {
    if (currentPage > 1) loadPage(currentPage - 1);
  });
  document.getElementById('pag-next').addEventListener('click', () => {
    if (currentPage < totalPages) loadPage(currentPage + 1);
  });
}