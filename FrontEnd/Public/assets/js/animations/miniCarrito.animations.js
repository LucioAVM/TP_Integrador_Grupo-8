// Animaciones para el mini carrito (#mini-carrito-container .card)
export function animarMiniCarrito() {
  anime({
    targets: '#mini-carrito-container .card',
    opacity: [0, 1],
    translateX: [0, -30],
    duration: 600,
    easing: 'easeOutExpo'
  });
}