export function renderCarrito(carrito) {
  const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  const total = carrito.reduce((acc, item) => acc + (item.cantidad || 1) * (item.precio || 0), 0);

  if (carrito.length === 0) {
    return `
      <section class="cart-screen container py-3">
        <div class="cart-empty-panel">
          <h2 class="cart-empty-title">Tu carrito esta vacio</h2>
          <p class="cart-empty-text">Agrega productos para continuar con la compra.</p>
          <button class="cart-primary-btn" id="ir-productos-btn">Ir a productos</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="cart-screen container py-3">
      <div class="cart-layout" id="productos-carrito">
        <section class="cart-items-panel">
          <div class="cart-panel-header">
            <h2 class="cart-panel-title">Detalle del carrito</h2>
            <span class="cart-items-count">${totalItems} items</span>
          </div>
          <div class="cart-items-list">
            ${carrito.map((item, idx) => {
              const cantidad = item.cantidad || 1;
              const precio = item.precio || 0;
              const subtotal = cantidad * precio;
              return `
                <article class="cart-item" data-idx="${idx}">
                  ${item.imagen
                    ? `<img src="${item.imagen}" class="cart-item-image" alt="${item.nombre || item.name || "Producto"}">`
                    : `<div class="cart-item-image"></div>`
                  }
                  <div>
                    <h3 class="cart-item-title">${item.nombre || item.name || "Producto"}</h3>
                    <p class="cart-item-meta">Precio unitario: $${Number(precio).toFixed(2)}</p>
                    <div class="cart-item-controls">
                      <button class="cart-qty-btn btn-restar" type="button" data-idx="${idx}">-</button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        step="1"
                        inputmode="numeric"
                        class="cart-qty-input"
                        value="${cantidad}"
                        data-idx="${idx}"
                        aria-label="Cantidad de ${item.nombre || item.name || 'producto'}"
                      >
                      <button class="cart-qty-btn btn-sumar" type="button" data-idx="${idx}">+</button>
                    </div>
                  </div>
                  <div class="cart-item-side">
                    <p class="cart-item-subtotal">$${Number(subtotal).toFixed(2)}</p>
                    <button type="button" class="cart-remove-btn btn-eliminar" data-idx="${idx}">Quitar</button>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </section>

        <aside class="cart-summary-panel">
          <h3 class="cart-summary-title">Resumen</h3>
          <div class="cart-summary-row">
            <span>Productos</span>
            <span>${totalItems}</span>
          </div>
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>$${Number(total).toFixed(2)}</span>
          </div>
          <div class="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>$${Number(total).toFixed(2)}</span>
          </div>

          <div class="cart-actions">
            <button class="cart-secondary-btn" id="seguir-comprando-btn">Seguir comprando</button>
            <button id="confirmar-btn" class="cart-primary-btn">Confirmar compra</button>
          </div>
        </aside>
      </div>
    </section>
  `;
}