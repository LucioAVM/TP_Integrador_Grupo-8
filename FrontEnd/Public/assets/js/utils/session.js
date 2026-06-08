export function tieneNombreUsuario() {
  const nombre = localStorage.getItem('nombre_usuario');
  return Boolean(nombre && nombre.trim());
}

export function tieneTicket() {
  return Boolean(localStorage.getItem('ultimo_ticket'));
}

export function limpiarSesionCliente() {
  localStorage.removeItem('nombre_usuario');
  localStorage.removeItem('nombreCliente');
  localStorage.removeItem('ultimo_ticket');
  localStorage.removeItem('carrito');
}
