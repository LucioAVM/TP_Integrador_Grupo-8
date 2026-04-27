// Animaciones para el mini carrito (#mini-carrito-container .card)
export function animarMiniCarrito() {
  if (typeof anime === 'undefined') return;

  const card = document.querySelector('#mini-carrito-container .mini-cart-card');
  if (!card) return;

  if (!card.dataset.animated) {
    card.dataset.animated = '1';
    anime({
      targets: card,
      opacity: [0, 1],
      translateX: [20, 0],
      duration: 500,
      easing: 'easeOutExpo'
    });
  }

  anime({
    targets: '#mini-carrito-container .mini-cart-item',
    opacity: [0, 1],
    translateY: [6, 0],
    delay: anime.stagger(35),
    duration: 260,
    easing: 'easeOutQuad'
  });
}

export function animarAccionMiniCarrito({ productId, action = 'update' } = {}) {
  if (typeof anime === 'undefined' || !productId) return;

  const item = document.querySelector(`#mini-carrito-container .mini-cart-item[data-id="${productId}"]`);
  if (!item) return;

  anime({
    targets: item,
    scale: [0.98, 1.01, 1],
    duration: 260,
    easing: 'easeOutQuad'
  });

  const qty = item.querySelector('.mini-cart-qty');
  if (qty && (action === 'add' || action === 'increase' || action === 'decrease')) {
    anime({
      targets: qty,
      scale: [1, 1.25, 1],
      duration: 260,
      easing: 'easeOutBack'
    });
  }
}

export function mostrarFeedbackMiniCarrito(message) {
  if (!message) return;

  let layer = document.getElementById('mini-cart-toast-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'mini-cart-toast-layer';
    document.body.appendChild(layer);
  }

  const toast = document.createElement('div');
  toast.className = 'mini-cart-toast';
  toast.textContent = message;
  layer.appendChild(toast);

  if (typeof anime === 'undefined') {
    setTimeout(() => toast.remove(), 1400);
    return;
  }

  anime({
    targets: toast,
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 180,
    easing: 'easeOutQuad',
    complete: () => {
      anime({
        targets: toast,
        opacity: [1, 0],
        translateY: [0, -8],
        delay: 950,
        duration: 220,
        easing: 'easeInQuad',
        complete: () => toast.remove()
      });
    }
  });
}