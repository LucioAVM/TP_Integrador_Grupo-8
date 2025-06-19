export function renderCarrito(carrito) {
  if (carrito.length === 0) {
    return `<p class='text-light'>El carrito está vacío.</p>`;
  }
  return `
    <div class="row" id="productos-carrito">
      ${carrito.map((item, idx) => {
        const cantidad = item.cantidad || 1;
        const precio = item.precio || 0;
        const subtotal = cantidad * precio;
        return `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100 producto-card position-relative">
              <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 btn-eliminar" data-idx="${idx}" title="Eliminar">
                &times;
              </button>
              <div class="ratio ratio-1x1" style="overflow:hidden;">
                ${item.imagen ? `<img src="${item.imagen}" class="card-img-top" alt="${item.nombre || item.name || "Producto"}" style="object-fit:cover;width:100%;height:100%;">` : ""}
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.nombre || item.name || "Producto"}</h5>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-success">Precio: $${precio}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge bg-info">Subtotal: $${subtotal}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="input-group input-group-sm" style="width: 110px;">
                    <button class="btn btn-outline-secondary btn-restar" type="button" data-idx="${idx}">-</button>
                    <input type="text" class="form-control text-center" value="${cantidad}" readonly style="max-width:40px;">
                    <button class="btn btn-outline-secondary btn-sumar" type="button" data-idx="${idx}">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
    <div class="d-flex justify-content-end align-items-center mt-4 gap-3 flex-wrap">
      <div class="fs-5 text-light me-auto">
        <strong>Total a pagar: $${carrito.reduce((acc, item) => acc + (item.cantidad || 1) * (item.precio || 0), 0)}</strong>
      </div>
      <button id="confirmar-btn" class="btn btn-success btn-lg">Confirmar</button>
    </div>
  `;
}