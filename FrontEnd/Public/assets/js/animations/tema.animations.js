// Animación para el cambio de modo claro/oscuro
export function animarCambioModo() {
  anime({
    targets: 'body',
    opacity: [0.7, 1],
    duration: 400,
    easing: 'easeOutQuad'
  });
}