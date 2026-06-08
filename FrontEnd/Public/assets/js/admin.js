import {
  fenrirSwal,
  fenrirConfirmAction,
  fenrirConfirmDelete,
  fenrirAlertError,
} from './utils/fenrirSwal.js';

function actualizarFilaProducto(fila, producto) {
  if (!fila || !producto) return;

  fila.className = producto.activo ? '' : 'table-secondary';

  const badgeCell = fila.cells[3];
  if (badgeCell) {
    badgeCell.innerHTML = producto.activo
      ? '<span class="badge bg-success">Activo</span>'
      : '<span class="badge bg-secondary">Inactivo</span>';
  }

  const btn = fila.querySelector('.desactivar, .reactivar');
  if (btn) {
    btn.className = producto.activo
      ? 'btn btn-sm btn-danger desactivar'
      : 'btn btn-sm btn-success reactivar';
    btn.textContent = producto.activo ? 'Desactivar' : 'Reactivar';
    btn.setAttribute('data-id', String(producto.id));
  }
}

async function toggleProducto(btn, accion) {
  const id = btn.getAttribute('data-id');
  if (!id) return;

  const confirmFn = accion === 'desactivar' ? fenrirConfirmDelete : fenrirConfirmAction;
  const result = await confirmFn({
    title: accion === 'desactivar' ? '¿Desactivar producto?' : '¿Reactivar producto?',
    text: accion === 'desactivar'
      ? 'El producto dejará de mostrarse en el catálogo del cliente.'
      : 'El producto volverá a mostrarse en el catálogo del cliente.',
    confirmButtonText: accion === 'desactivar' ? 'Sí, desactivar' : 'Sí, reactivar',
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/productos/${id}/${accion}`, { method: 'POST' });
    if (!res.ok) {
      fenrirAlertError('Error', `No se pudo ${accion} el producto.`);
      return;
    }

    const producto = await res.json();
    const fila = btn.closest('tr[data-id]');
    actualizarFilaProducto(fila, producto);

    fenrirSwal.fire({
      title: '¡Listo!',
      text: `El producto fue ${producto.activo ? 'reactivado' : 'desactivado'} correctamente.`,
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error(err);
    fenrirAlertError('Error', 'No se pudo completar la acción.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    const btnDesactivar = event.target.closest('.desactivar');
    if (btnDesactivar) {
      event.preventDefault();
      toggleProducto(btnDesactivar, 'desactivar');
      return;
    }

    const btnReactivar = event.target.closest('.reactivar');
    if (btnReactivar) {
      event.preventDefault();
      toggleProducto(btnReactivar, 'reactivar');
    }
  });
});
