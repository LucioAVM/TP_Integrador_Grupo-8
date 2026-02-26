export function renderTicket(cart, total, fecha, nombre_usuario) {
  if (!cart || cart.length === 0) {
    return `<div class="alert alert-warning">El carrito está vacío.</div>`;
  }
  return `
    <div class="ticket-wrapper p-4 bg-dark rounded border border-secondary">
        <h2 class="text-light mb-4 text-center">Ticket de Compra</h2>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-light fs-5"><strong>Fenrir 3D</strong></span>
          <span id="ticket-date" class="text-light">${fecha}</span>
        </div>
        <div class="mb-4">
          <span class="text-light"><strong>Cliente:</strong> ${nombre_usuario || 'Consumidor Final'}</span>
        </div>
        <table class="table table-dark table-striped">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => {
                const price = item.price ?? item.precio ?? 0;
                const quantity = item.quantity ?? item.cantidad ?? 1;
                return `
                <tr>
                <td>${item.name ?? item.nombre ?? 'Producto 3D'}</td>
                <td>${quantity}</td>
                <td>$${price.toFixed(2)}</td>
                <td>$${(price * quantity).toFixed(2)}</td>
                </tr>
                `;
            }).join('')}
          </tbody>
        </table>
        <div class="card bg-secondary text-light p-3 mb-4">
          <div class="d-flex justify-content-between fs-5">
            <span><strong>Total:</strong></span>
            <span id="cart-total">$${total.toFixed(2)}</span>
          </div>
        </div>
        <div class="text-center mt-3">
            <div class="d-flex justify-content-center mt-4">
                <button id="btn-descargar-pdf" class="btn btn-success me-3">📄 Descargar PDF</button>
                <a href="/encuesta" class="btn btn-outline-light">Salir</a>
            </div>
        </div>
    </div>
  `;
}