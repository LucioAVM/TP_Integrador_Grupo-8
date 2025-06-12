// Animaciones para los filtros (#filtros-container .card)
export function animarFiltros() {
  anime({
    targets: '#filtros-container .card',
    opacity: [0, 1],
    translateX: [-30, 0],
    duration: 600,
    easing: 'easeOutExpo'
  });
}