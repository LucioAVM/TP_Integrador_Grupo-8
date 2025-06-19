import { renderCarrito } from '../components/carrito.js';
import { renderMiniCarrito } from '../components/miniCarrito.js';

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- Funciones globales para el mini carrito ---
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
  const miniCarritoContainer = document.getElementById('mini-carrito-container');
  if (miniCarritoContainer) {
    miniCarritoContainer.innerHTML = renderMiniCarrito(carrito);

    // Botón eliminar del mini carrito
    document.querySelectorAll('.btn-eliminar-carrito').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        eliminarDelCarrito(id);
      });
    });

    // Botón ver carrito
    const btnVerCarrito = document.getElementById('ver-carrito-btn');
    if (btnVerCarrito) {
      btnVerCarrito.addEventListener('click', () => {
        window.location.href = 'carrito.html';
      });
    }
  }
}

export function getCarrito() {
  return carrito;
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// --- Lógica de la pantalla de carrito ---
export function initCarrito() {
  const container = document.getElementById("carrito-container");

  function guardarYActualizar() {
    guardarCarritoEnLocalStorage();
    renderizar();
  }

  function renderizar() {
    container.innerHTML = renderCarrito(carrito);

    // Confirmar compra
    const btnConfirmar = document.getElementById("confirmar-btn");
    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", function () {
        alert("¡Compra confirmada!");
        // Aquí puedes agregar la lógica para procesar la compra
      });
    }

    // Sumar/restar cantidad
    container.querySelectorAll(".btn-sumar").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
        guardarYActualizar();
      });
    });
    container.querySelectorAll(".btn-restar").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        if ((carrito[idx].cantidad || 1) > 1) {
          carrito[idx].cantidad -= 1;
          guardarYActualizar();
        } else {
          const nombre = carrito[idx].nombre || carrito[idx].name || "este producto";
          if (confirm(`¿Seguro que deseas eliminar ${nombre} del carrito?`)) {
            carrito.splice(idx, 1);
            guardarYActualizar();
          }
        }
      });
    });

    // Eliminar producto
    container.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        const nombre = carrito[idx].nombre || carrito[idx].name || "este producto";
        if (confirm(`¿Seguro que deseas eliminar ${nombre} del carrito?`)) {
          carrito.splice(idx, 1);
          guardarYActualizar();
        }
      });
    });
  }

  renderizar();
}