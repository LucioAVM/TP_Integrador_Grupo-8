document.addEventListener('DOMContentLoaded', () => {
  // Animar la entrada del contenedor principal
  anime({
    targets: '.contenedor',
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });

  // Animar la entrada de la tabla
  anime({
    targets: '.table',
    opacity: [0, 1],
    translateY: [-20, 0],
    delay: 300,
    duration: 800,
    easing: 'easeOutQuad'
  });

  // Animar los botones al hacer hover
  const botones = document.querySelectorAll('.btn');
  botones.forEach(boton => {
    boton.addEventListener('mouseenter', () => {
      anime({
        targets: boton,
        scale: 1.1,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
    boton.addEventListener('mouseleave', () => {
      anime({
        targets: boton,
        scale: 1,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
});