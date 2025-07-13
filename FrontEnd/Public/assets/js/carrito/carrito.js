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
  btnConfirmar.addEventListener("click", async function () {
    const nombre_usuario = localStorage.getItem('nombre_usuario') || 'Invitado';
    const productos = carrito.map(item => ({
      producto_id: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario, productos, total })
      });

      if (response.ok) {
        // Guarda los datos del ticket ANTES de limpiar el carrito
        localStorage.setItem('ultimo_ticket', JSON.stringify({
          carrito: [...carrito],
          total,
          fecha: new Date().toISOString(),
          nombre_usuario
        }));
        alert("¡Compra confirmada!");
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify([]));
        window.location.href = "/ticket.html";
      } else {
        const error = await response.json();
        alert("Error al registrar la venta: " + (error.error || "Intenta de nuevo"));
      }
    } catch (err) {
      alert("Error de conexión al registrar la venta.");
    }
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