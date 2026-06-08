export function renderTicket(cart, total, fecha, nombre_usuario) {
  if (!cart || cart.length === 0) {
    return `<div class="alert alert-warning">El carrito está vacío.</div>`;
  }
  return `
    <div class="ticket-wrapper fenrir-panel">
      <div class="ticket-header">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <p class="fenrir-eyebrow mb-1">Comprobante</p>
            <h2 class="ticket-brand mb-0">Fenrir 3D</h2>
          </div>
          <span id="ticket-date" class="ticket-date"><i class="bi bi-calendar3 me-1"></i>${fecha}</span>
        </div>
      </div>
      <div class="ticket-meta">
        <i class="bi bi-person me-1"></i><strong>Cliente:</strong> ${nombre_usuario || 'Consumidor Final'}
      </div>
      <div class="ticket-table-wrap">
        <table class="ticket-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>P. unit.</th>
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
      </div>
      <div class="ticket-total-panel">
        <span>Total</span>
        <span id="cart-total">$${total.toFixed(2)}</span>
      </div>
      <div class="ticket-actions">
        <button id="btn-descargar-pdf" class="btn btn-fenrir-success">
          <i class="bi bi-file-earmark-pdf me-1"></i> PDF
        </button>
        <a href="/encuesta" class="btn btn-fenrir-secondary">
          <i class="bi bi-chat-square-text me-1"></i> Encuesta
        </a>
        <button id="btn-reiniciar" type="button" class="btn btn-primary btn-fenrir-primary">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reiniciar
        </button>
      </div>
    </div>
  `;
}
