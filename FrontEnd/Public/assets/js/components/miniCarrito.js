export function renderMiniCarrito(carrito) {
  const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  const total = carrito.reduce((acc, item) => acc + ((item.precio || 0) * (item.cantidad || 1)), 0);

  if (carrito.length === 0) {
    return `
      <div class="card mini-cart-card mini-cart-empty">
        <div class="card-header mini-cart-header d-flex align-items-center justify-content-between">
          <span>Mi Carrito</span>
          <span class="mini-cart-chip">0 items</span>
        </div>
        <div class="card-body text-center mini-cart-empty-body">
          <div class="mini-cart-empty-icon" aria-hidden="true">🛒</div>
          <p class="mb-1 fw-semibold">Carrito vacio</p>
          <p class="mb-0 mini-cart-empty-text">Agrega productos para verlos aqui.</p>
        </div>
        <div class="card-footer mini-cart-footer">
          <button class="btn mini-cart-primary w-100" id="ver-carrito-btn">Ver carrito</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="card mini-cart-card">
      <div class="card-header mini-cart-header d-flex align-items-center justify-content-between">
        <span>Mi Carrito</span>
        <span class="mini-cart-chip">${totalItems} items</span>
      </div>
      <ul class="list-group list-group-flush mini-cart-list">
        ${carrito.map(item => `
          <li class="list-group-item mini-cart-item" data-id="${item.id}">
            <img src="${item.imagen}" alt="${item.nombre}" width="52" height="52" class="mini-cart-thumb" />
            <div class="mini-cart-content">
              <p class="mini-cart-name" title="${item.nombre}">${item.nombre}</p>
              <p class="mini-cart-meta">$${Number(item.precio || 0).toFixed(2)} c/u</p>
              <div class="mini-cart-controls">
                <button class="mini-cart-qty-btn btn-mini-decrease" data-id="${item.id}" aria-label="Restar uno">-</button>
                <span class="mini-cart-qty">${item.cantidad || 1}</span>
                <button class="mini-cart-qty-btn btn-mini-increase" data-id="${item.id}" aria-label="Sumar uno">+</button>
                <button class="mini-cart-remove btn-eliminar-carrito" data-id="${item.id}" aria-label="Eliminar item">Quitar</button>
              </div>
            </div>
            <div class="mini-cart-subtotal">$${Number((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</div>
          </li>
        `).join('')}
      </ul>
      <div class="card-body mini-cart-summary">
        <div class="mini-cart-summary-row">
          <span>Subtotal</span>
          <strong>$${total.toFixed(2)}</strong>
        </div>
      </div>
      <div class="card-footer mini-cart-footer d-grid gap-2">
        <button class="btn mini-cart-secondary w-100" id="vaciar-carrito-btn">Vaciar carrito</button>
        <button class="btn mini-cart-primary w-100" id="ver-carrito-btn">Ir al carrito</button>
      </div>
    </div>
  `;
}