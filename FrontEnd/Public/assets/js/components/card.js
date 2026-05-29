export function renderProductCard(producto) {
  return `
    <div class="card product-card shadow" style="width: 300px; min-height: 480px; position: relative; overflow: hidden;">
      <div class="parallax-overlay"></div>
      <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.nombre}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-truncate" title="${producto.nombre}">${producto.nombre}</h5>
        <p class="card-text flex-grow-1" style="min-height: 60px;">${producto.descripcion}</p>
        <p class="card-text fw-bold mb-2">$${producto.precio}</p>
        <div class="d-grid gap-2 mt-auto">
          <a class="btn btn-outline-secondary" href="/producto_detalle.html?id=${producto.id}">Ver detalle</a>
          <button class="btn btn-primary" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `;
}