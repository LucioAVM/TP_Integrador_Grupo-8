export function animarBienvenida() {
  anime({
    targets: '#bienvenida-container .card',
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 700,
    easing: 'easeOutExpo'
  });
}