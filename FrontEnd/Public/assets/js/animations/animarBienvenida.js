export function animarBienvenida() {
    // Animar la tarjeta principal
    anime({
        targets: '#bienvenida-container .card',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 700,
        easing: 'easeOutExpo'
    });

    // Animar el título
    anime({
        targets: '#bienvenida-container .card h2',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: 300,
        duration: 600,
        easing: 'easeOutExpo'
    });

    // Animar el campo de nombre
    anime({
        targets: '#bienvenida-container .card #nombre',
        opacity: [0, 1],
        translateX: [-40, 0],
        delay: 500,
        duration: 600,
        easing: 'easeOutExpo'
    });

    // Animar el botón
    anime({
        targets: '#bienvenida-container .card button[type="submit"]',
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: 700,
        duration: 500,
        easing: 'easeOutBack'
    });
}