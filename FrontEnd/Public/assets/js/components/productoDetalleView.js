export function renderProductoDetallePanel(producto, options = {}) {
  const { modal = false } = options;
  const p = producto;
  const meta = `${p.categoria || 'Producto'} · ${p.tipo || ''}`.trim();

  const closeBtn = modal
    ? `<button type="button" class="btn-close detalle-modal-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>`
    : '';

  const catalogLink = modal
    ? ''
    : `<a href="/producto.html" class="btn btn-fenrir-secondary">
         <i class="bi bi-arrow-left me-1"></i> Catálogo
       </a>`;

  const titleIdAttr = modal ? ' id="producto-detalle-modal-label"' : '';

  return `
    <div class="detalle-panel fenrir-panel${modal ? ' detalle-panel--modal' : ''}">
      ${closeBtn}
      <div class="row g-4 align-items-start">
        <div class="col-md-5">
          <div class="detalle-img-wrap">
            <img src="${p.imagen || ''}" class="detalle-img" alt="${p.nombre || 'Producto'}" />
          </div>
        </div>
        <div class="col-md-7">
          <p class="fenrir-eyebrow mb-1">${meta}</p>
          <h2 class="detalle-title"${titleIdAttr}>${p.nombre || 'Producto'}</h2>
          <p class="detalle-desc">${p.descripcion || ''}</p>
          <p class="fenrir-price mb-3">$${p.precio}</p>
          <div class="detalle-actions">
            <label class="visually-hidden" for="input-cantidad">Cantidad</label>
            <input
              id="input-cantidad"
              type="number"
              min="1"
              max="99"
              value="1"
              class="form-control detalle-qty"
            />
            <button type="button" id="btn-add-carrito" class="btn btn-primary btn-fenrir-primary">
              <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
            </button>
            ${catalogLink}
          </div>
        </div>
      </div>
    </div>
  `;
}
