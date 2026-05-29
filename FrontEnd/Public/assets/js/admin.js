// Admin UI helpers
document.addEventListener('DOMContentLoaded', () => {
  const desactivarBtns = document.querySelectorAll('.desactivar');
  desactivarBtns.forEach(btn => btn.addEventListener('click', async (e) => {
    const id = btn.getAttribute('data-id');
    if (!id) return;
    const confirmed = confirm('¿Desea desactivar este producto?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/admin/productos/${id}/desactivar`, { method: 'POST' });
      if (res.ok) location.reload();
    } catch (err) {
      console.error(err);
      alert('Error al desactivar');
    }
  }));

  const reactivarBtns = document.querySelectorAll('.reactivar');
  reactivarBtns.forEach(btn => btn.addEventListener('click', async (e) => {
    const id = btn.getAttribute('data-id');
    if (!id) return;
    const confirmed = confirm('¿Desea reactivar este producto?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/admin/productos/${id}/reactivar`, { method: 'POST' });
      if (res.ok) location.reload();
    } catch (err) {
      console.error(err);
      alert('Error al reactivar');
    }
  }));
});
