import { agregarAlCarrito } from '../carrito/carrito.js';

export function initProductoDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('producto-detalle-container');
  if (!id || !container) return;

  fetch(`/api/productos/${encodeURIComponent(id)}`)
    .then(res => {
      if (!res.ok) throw new Error('Producto no encontrado');
      return res.json();
    })
    .then(producto => {
      container.innerHTML = renderDetail(producto);
      document.getElementById('btn-add-carrito')?.addEventListener('click', () => {
        const cantidadEl = document.getElementById('input-cantidad');
        const cantidad = Number(cantidadEl?.value || 1);
        agregarAlCarrito({ ...producto, cantidad });
      });
    })
    .catch(err => {
      console.error('Error cargando detalle:', err);
      container.innerHTML = `<div class="alert alert-danger">No se pudo cargar el producto.</div>`;
    });
}

function renderDetail(p) {
  return `
    <div class="detalle-panel fenrir-panel">
      <div class="row g-4 align-items-start">
        <div class="col-md-5">
          <div class="detalle-img-wrap">
            <img src="${p.imagen}" class="detalle-img" alt="${p.nombre}" />
          </div>
        </div>
        <div class="col-md-7">
          <p class="fenrir-eyebrow mb-1">${p.categoria || 'Producto'} · ${p.tipo || ''}</p>
          <h2 class="detalle-title">${p.nombre}</h2>
          <p class="detalle-desc">${p.descripcion || ''}</p>
          <p class="fenrir-price mb-3">$${p.precio}</p>
          <div class="detalle-actions">
            <input id="input-cantidad" type="number" min="1" value="1" class="form-control detalle-qty" />
            <button id="btn-add-carrito" class="btn btn-primary btn-fenrir-primary">
              <i class="bi bi-cart-plus me-1"></i> Agregar
            </button>
            <a href="/producto.html" class="btn btn-fenrir-secondary">
              <i class="bi bi-arrow-left me-1"></i> Catálogo
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
