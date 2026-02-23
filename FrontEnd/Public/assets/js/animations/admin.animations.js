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

  // Manejar activar/desactivar productos con AJAX
  const tablaProductos = document.querySelector('table');

  // Verificar si el elemento existe antes de agregar el evento
  if (tablaProductos) {
    tablaProductos.addEventListener('click', async (event) => {
      const target = event.target;

      if (target.classList.contains('desactivar') || target.classList.contains('reactivar')) {
        const productoId = target.getAttribute('data-id');
        const accion = target.classList.contains('desactivar') ? 'desactivar' : 'reactivar';

        try {
          const response = await fetch(`/productos/${productoId}/${accion}`, {
            method: 'POST',
          });

          if (response.ok) {
            const producto = await response.json();

            // Actualizar la fila del producto
            const fila = document.querySelector(`tr[data-id="${producto.id}"]`);
            fila.className = producto.activo ? 'table-success' : 'table-danger';
            fila.querySelector('.activo').textContent = producto.activo ? 'Sí' : 'No';

            // Actualizar botones
            const botonDesactivar = fila.querySelector('.desactivar');
            const botonReactivar = fila.querySelector('.reactivar');

            if (producto.activo) {
              // Cambiar a botón "Desactivar"
              if (botonReactivar) {
                botonReactivar.classList.replace('reactivar', 'desactivar');
                botonReactivar.textContent = 'Desactivar';
                botonReactivar.classList.replace('btn-success', 'btn-danger');
              }
            } else {
              // Cambiar a botón "Reactivar"
              if (botonDesactivar) {
                botonDesactivar.classList.replace('desactivar', 'reactivar');
                botonDesactivar.textContent = 'Reactivar';
                botonDesactivar.classList.replace('btn-danger', 'btn-success');
              }
            }
          } else {
            console.error('Error al realizar la acción:', response.statusText);
          }
        } catch (error) {
          console.error('Error al realizar la acción:', error);
        }
      }

      // Manejar redirección al formulario de edición
      if (target.classList.contains('editar')) {
        const productoId = target.getAttribute('data-id');
        window.location.href = `/productos/${productoId}/editar`;
      }
    });
  }
});