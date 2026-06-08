import {
  fenrirConfirmAction,
  fenrirConfirmDelete,
  fenrirAlertError,
} from './utils/fenrirSwal.js';

document.addEventListener('DOMContentLoaded', () => {
  const desactivarBtns = document.querySelectorAll('.desactivar');
  desactivarBtns.forEach((btn) => btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-id');
    if (!id) return;

    const result = await fenrirConfirmDelete({
      title: '¿Desactivar producto?',
      text: 'El producto dejará de mostrarse en el catálogo del cliente.',
      confirmButtonText: 'Sí, desactivar',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/admin/productos/${id}/desactivar`, { method: 'POST' });
      if (res.ok) location.reload();
      else fenrirAlertError('Error', 'No se pudo desactivar el producto.');
    } catch (err) {
      console.error(err);
      fenrirAlertError('Error', 'No se pudo desactivar el producto.');
    }
  }));

  const reactivarBtns = document.querySelectorAll('.reactivar');
  reactivarBtns.forEach((btn) => btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-id');
    if (!id) return;

    const result = await fenrirConfirmAction({
      title: '¿Reactivar producto?',
      text: 'El producto volverá a mostrarse en el catálogo del cliente.',
      confirmButtonText: 'Sí, reactivar',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/admin/productos/${id}/reactivar`, { method: 'POST' });
      if (res.ok) location.reload();
      else fenrirAlertError('Error', 'No se pudo reactivar el producto.');
    } catch (err) {
      console.error(err);
      fenrirAlertError('Error', 'No se pudo reactivar el producto.');
    }
  }));
});
