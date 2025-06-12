// Animaciones para las tarjetas de producto (.product-card)
export function animarProductos() {
  anime({
    targets: '.product-card',
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(100),
    duration: 700,
    easing: 'easeOutExpo'
  });
}