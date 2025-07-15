document.addEventListener('DOMContentLoaded', () => {
  // Animar la entrada de la tarjeta de registro
  anime({
    targets: '.card',
    opacity: [0, 1],
    translateY: [-50, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });

  // Animar el botón al hacer hover
  const boton = document.querySelector('.boton-primario');
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

  // Animar los campos del formulario al enfocarlos
  const inputs = document.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      anime({
        targets: input,
        borderColor: '#007bff',
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
});