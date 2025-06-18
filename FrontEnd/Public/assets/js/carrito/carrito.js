import { renderMiniCarrito } from '../components/miniCarrito.js';

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

export function agregarAlCarrito(producto) {
  const existe = carrito.find(item => item.id === producto.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarritoEnLocalStorage();
  renderMiniCarritoEnDOM();
}

export function eliminarDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad -= 1;
    } else {
      carrito.splice(index, 1);
    }
    guardarCarritoEnLocalStorage();
    renderMiniCarritoEnDOM();
  }
}

export function renderMiniCarritoEnDOM() {
  document.getElementById('mini-carrito-container').innerHTML = renderMiniCarrito(carrito);

  // Asocia el evento a los botones de eliminar
  document.querySelectorAll('.btn-eliminar-carrito').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      eliminarDelCarrito(id);
    });
  });
}

export function getCarrito() {
  return carrito;
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

export function initCarrito() {
  renderMiniCarritoEnDOM();
}