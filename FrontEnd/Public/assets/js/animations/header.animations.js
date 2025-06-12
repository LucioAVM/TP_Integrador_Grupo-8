// Animaciones para el header
export function animarHeader() {
  anime({
    targets: 'header',
    translateY: [-60, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });
}