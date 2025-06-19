export function renderTicket(cart, total, fecha) {
  if (!cart || cart.length === 0) {
    return `<div class="alert alert-warning">El carrito está vacío.</div>`;
  }
  return `
    <h2 class="text-light mb-4">Ticket de Compra</h2>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-light fs-5"><strong>Fenrir 3D</strong></span>
      <span id="ticket-date" class="text-light">${fecha}</span>
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
            <td>${item.name ?? item.nombre ?? ''}</td>
            <td>${quantity}</td>
            <td>$${price.toFixed(2)}</td>
            <td>$${(price * quantity).toFixed(2)}</td>
            </tr>
            `;
        }).join('')}
      </tbody>
    </table>
    <div class="card bg-secondary text-light p-3">
      <div class="d-flex justify-content-between">
        <span><strong>Total:</strong></span>
        <span id="cart-total">$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
}