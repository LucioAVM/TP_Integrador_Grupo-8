export function renderProductCard(producto) {
  return `
    <div class="card product-card shadow">
      <div class="parallax-overlay"></div>
      <div class="product-img-wrap">
        <img src="${producto.imagen}" class="product-img" alt="${producto.nombre}" loading="lazy">
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-truncate" title="${producto.nombre}">${producto.nombre}</h5>
        <p class="card-text flex-grow-1" style="min-height: 60px;">${producto.descripcion}</p>
        <p class="fenrir-price mb-2">$${producto.precio}</p>
        <div class="d-grid gap-2 mt-auto">
          <a class="btn btn-fenrir-secondary btn-sm" href="/producto_detalle.html?id=${producto.id}">
            <i class="bi bi-eye me-1"></i> Detalle
          </a>
          <button class="btn btn-primary btn-fenrir-primary btn-sm" data-id="${producto.id}">
            <i class="bi bi-cart-plus me-1"></i> Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}