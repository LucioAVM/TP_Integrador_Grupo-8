export function renderMiniCarrito(carrito) {
  if (carrito.length === 0) {
    return `
      <div class="card">
        <div class="card-header fw-bold">Mini Carrito</div>
        <div class="card-body text-center text-muted">El carrito está vacío</div>
      </div>
    `;
  }
  return `
    <div class="card">
      <div class="card-header fw-bold">Mini Carrito</div>
      <ul class="list-group list-group-flush">
        ${carrito.map(item => `
          <li class="list-group-item d-flex align-items-center">
            <img src="${item.imagen}" alt="${item.nombre}" width="40" height="40" class="me-2 rounded" />
            <span class="flex-grow-1">${item.nombre}</span>
            <span class="badge bg-primary rounded-pill ms-2">${item.cantidad}</span>
          </li>
        `).join('')}
      </ul>
      <div class="card-body">
        <button class="btn btn-success w-100" id="ver-carrito-btn">Ver carrito</button>
      </div>
    </div>
  `;
}