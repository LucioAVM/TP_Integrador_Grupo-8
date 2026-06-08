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
let totalProducts = 0;

export function initProducto() {
  getFiltros().then(({ categorias, tipos }) => {
    const filtrosContainer = document.getElementById('filtros-container');
    if (filtrosContainer) filtrosContainer.innerHTML = renderFiltros(categorias, tipos);
    animarFiltros();
    document.querySelectorAll('input[name="categoria"], input[name="tipo"]').forEach(input => {
      input.addEventListener('change', () => loadPage(1));
    });
  }).catch(err => {
    console.error('Error al cargar filtros:', err);
  }).finally(() => loadPage(1));
}

async function loadPage(page = 1) {
  try {
    const catEl = document.querySelector('input[name="categoria"]:checked');
    const tipoEl = document.querySelector('input[name="tipo"]:checked');
    const categoria = catEl && catEl.value !== 'todas' ? catEl.value : null;
    const tipo = tipoEl && tipoEl.value !== 'todos' ? tipoEl.value : null;

    const data = await getProductos({ page, limit: currentLimit, categoria, tipo });
    const productos = data && Array.isArray(data.products) ? data.products : [];

    totalPages = Math.max(data.totalPages || 1, 1);
    totalProducts = data.total ?? productos.length;

    if (page > totalPages && totalPages > 0) {
      return loadPage(totalPages);
    }

    productosGlobal = productos;
    currentPage = data.page || page;

    renderProductos(productos);
    renderPagination();

    renderMiniCarritoEnDOM();
    animarMiniCarrito();
    animarHeader();
  } catch (err) {
    console.error('Error al cargar productos:', err);
    const container = document.getElementById('productos-container');
    if (container) {
      container.innerHTML = `
        <div class="fenrir-panel catalog-empty">
          <p class="mb-0">No se pudieron cargar los productos. Intentá recargar la página.</p>
        </div>`;
    }
    renderPagination(true);
  }
}

function renderProductos(productos) {
  const container = document.getElementById('productos-container');
  if (!container) return;

  if (productos.length === 0) {
    container.innerHTML = `
      <div class="fenrir-panel catalog-empty">
        <p class="fenrir-eyebrow mb-1">Sin resultados</p>
        <p class="mb-0">No hay productos activos con los filtros seleccionados.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="productos-grid">
      ${productos.map(renderProductCard).join('')}
    </div>`;

  container.querySelectorAll('.btn.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      const producto = productosGlobal.find(p => p.id === id);
      if (!producto) return;
      agregarAlCarrito(producto);
    });
  });
  animarProductos();
  activarParalajeCards();
}

function renderPagination(hide = false) {
  const pagDiv = document.getElementById('productos-pagination');
  if (!pagDiv) return;

  const shouldHide = hide || totalProducts === 0 || totalPages <= 1;
  pagDiv.hidden = shouldHide;
  if (shouldHide) {
    pagDiv.innerHTML = '';
    return;
  }

  pagDiv.innerHTML = `
    <button class="fenrir-page-btn" id="pag-prev" type="button" ${currentPage <= 1 ? 'disabled' : ''} aria-label="Página anterior">
      <i class="bi bi-chevron-left"></i> Anterior
    </button>
    <span class="fenrir-page-info">
      Página <strong>${currentPage}</strong> de <strong>${totalPages}</strong>
      <span class="fenrir-page-count">(${totalProducts} productos)</span>
    </span>
    <button class="fenrir-page-btn" id="pag-next" type="button" ${currentPage >= totalPages ? 'disabled' : ''} aria-label="Página siguiente">
      Siguiente <i class="bi bi-chevron-right"></i>
    </button>
  `;

  document.getElementById('pag-prev')?.addEventListener('click', () => {
    if (currentPage > 1) loadPage(currentPage - 1);
  });
  document.getElementById('pag-next')?.addEventListener('click', () => {
    if (currentPage < totalPages) loadPage(currentPage + 1);
  });
}
