import {
  fenrirSwal,
  fenrirConfirmAction,
  fenrirConfirmDelete,
  fenrirAlertError,
} from '../utils/fenrirSwal.js';

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

  const tablaProductos = document.querySelector('table');

  if (tablaProductos) {
    tablaProductos.addEventListener('click', async (event) => {
      const target = event.target;

      if (target.classList.contains('desactivar') || target.classList.contains('reactivar')) {
        const productoId = target.getAttribute('data-id');
        const accion = target.classList.contains('desactivar') ? 'desactivar' : 'reactivar';
        const accionTexto = accion === 'desactivar' ? 'desactivar' : 'reactivar';

        const confirmFn = accion === 'desactivar' ? fenrirConfirmDelete : fenrirConfirmAction;
        const result = await confirmFn({
          title: `¿${accionTexto.charAt(0).toUpperCase() + accionTexto.slice(1)} producto?`,
          text: `¿Estás seguro de que deseas ${accionTexto} este producto?`,
          confirmButtonText: `Sí, ${accionTexto}`,
        });

        if (!result.isConfirmed) return;

        try {
          const response = await fetch(`/productos/${productoId}/${accion}`, {
            method: 'POST',
          });

          if (response.ok) {
            const producto = await response.json();
            const fila = document.querySelector(`tr[data-id="${producto.id}"]`);
            if (fila) fila.className = producto.activo ? '' : 'table-secondary';

            if (producto.activo) {
              target.classList.replace('reactivar', 'desactivar');
              target.textContent = 'Desactivar';
              target.classList.replace('btn-success', 'btn-danger');
            } else {
              target.classList.replace('desactivar', 'reactivar');
              target.textContent = 'Reactivar';
              target.classList.replace('btn-danger', 'btn-success');
            }

            fenrirSwal.fire({
              title: '¡Listo!',
              text: `El producto fue ${producto.activo ? 'reactivado' : 'desactivado'} correctamente.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            fenrirAlertError('Error', 'Hubo un problema al realizar la acción.');
          }
        } catch (error) {
          console.error('Error al realizar la acción:', error);
          fenrirAlertError('Error', 'Hubo un problema de conexión.');
        }
      }

      if (target.classList.contains('editar')) {
        const productoId = target.getAttribute('data-id');
        window.location.href = `/productos/${productoId}/editar`;
      }
    });
  }
});
