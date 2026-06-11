export function initProductoDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    window.location.replace(`/producto.html?detalle=${encodeURIComponent(id)}`);
    return;
  }

  window.location.replace('/producto.html');
}
