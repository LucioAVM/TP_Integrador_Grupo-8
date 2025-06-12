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

export function renderMiniCarritoEnDOM() {
  document.getElementById('mini-carrito-container').innerHTML = renderMiniCarrito(carrito);
}

export function getCarrito() {
  return carrito;
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}