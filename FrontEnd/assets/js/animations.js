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

export function animarMiniCarrito() {
  anime({
    targets: '#mini-carrito-container .card',
    translateX: [0, -30],
    duration: 600,
    easing: 'easeOutExpo'
  });
}

export function animarCambioModo() {
  anime({
    targets: 'body',
    opacity: [0.7, 1],
    duration: 400,
    easing: 'easeOutQuad'
  });
}

export function animarHeader() {
  anime({
    targets: 'header',
    translateY: [-60, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });
}

export function animarFiltros() {
  anime({
    targets: '#filtros-container .card',
    opacity: [0, 1],
    translateX: [-30, 0],
    duration: 600,
    easing: 'easeOutExpo'
  });
}

export function activarParalajeCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    const overlay = card.querySelector('.parallax-overlay');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxAngle = 18; // grados máximos de rotación

      // Calcula el ángulo de rotación en X e Y
      const rotateY = ((x - centerX) / centerX) * maxAngle;
      const rotateX = -((y - centerY) / centerY) * maxAngle;

      // Aplica la rotación
      card.style.transform = `perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

      // Luz: degradado radial centrado en el mouse
      overlay.style.background = `
        radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255,255,255,0.30) 0%,
          rgba(255,255,255,0.10) 40%,
          rgba(0,0,0,0.10) 70%,
          rgba(0,0,0,0.18) 100%
        )
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
      overlay.style.background = '';
    });
  });
}
/*
export function activarParalajeCards() {
  document.querySelectorAll('.paralax-card').forEach(card => {
    const img = card.querySelector('.parallax-img');
    const text = card.querySelector('.parallax-title-float');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Imagen: paralaje más intenso
      img.style.transform = `scale(1.08) translate(${x * 36}px, ${y * 36}px)`;

      // Texto: paralaje más sutil, pero con "altura"
      text.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
      text.style.filter = `drop-shadow(0 12px 24px rgba(0,0,0,0.45)) blur(${Math.abs(y) * 2.5}px)`;
    });
    card.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
      text.style.transform = 'translate(0,0)';
      text.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.35)) blur(0)';
    });
  });
}*/