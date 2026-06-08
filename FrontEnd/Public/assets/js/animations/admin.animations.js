document.addEventListener('DOMContentLoaded', () => {
  anime({
    targets: '.contenedor, .contenedor-editar, .admin-card',
    opacity: [0, 1],
    translateY: [-16, 0],
    duration: 700,
    easing: 'easeOutQuad',
  });

  anime({
    targets: '.table',
    opacity: [0, 1],
    translateY: [-12, 0],
    delay: 200,
    duration: 700,
    easing: 'easeOutQuad',
  });
});
