export function activarParalajeCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    const overlay = card.querySelector('.parallax-overlay');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxAngle = 5; // grados máximos de rotación

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