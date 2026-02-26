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
        const accionTexto = accion === 'desactivar' ? 'desactivar' : 'reactivar';

        const result = await Swal.fire({
          title: `¿${accionTexto.charAt(0).toUpperCase() + accionTexto.slice(1)} producto?`,
          text: `¿Estás seguro de que deseas ${accionTexto} este producto?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: accion === 'desactivar' ? '#dc3545' : '#28a745',
          cancelButtonColor: '#6c757d',
          confirmButtonText: `Sí, ${accionTexto}`,
          cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
          const response = await fetch(`/productos/${productoId}/${accion}`, {
            method: 'POST',
          });

          if (response.ok) {
            const producto = await response.json();

            // Actualizar la fila del producto
            const fila = document.querySelector(`tr[data-id="${producto.id}"]`);
            fila.className = producto.activo ? '' : 'table-secondary';

            // Actualizar botones
            if (producto.activo) {
              // Cambiar a botón "Desactivar"
              target.classList.replace('reactivar', 'desactivar');
              target.textContent = 'Desactivar';
              target.classList.replace('btn-success', 'btn-danger');
            } else {
              // Cambiar a botón "Reactivar"
              target.classList.replace('desactivar', 'reactivar');
              target.textContent = 'Reactivar';
              target.classList.replace('btn-danger', 'btn-success');
            }

            Swal.fire({
              title: '¡Éxito!',
              text: `El producto ha sido ${producto.activo ? 'reactivado' : 'desactivado'} correctamente.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire('Error', 'Hubo un problema al realizar la acción.', 'error');
          }
        } catch (error) {
          console.error('Error al realizar la acción:', error);
          Swal.fire('Error', 'Hubo un problema de conexión.', 'error');
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