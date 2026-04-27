import { renderCarrito } from '../components/carrito.js';
import { renderMiniCarrito } from '../components/miniCarrito.js';
import { animarMiniCarrito, animarAccionMiniCarrito, mostrarFeedbackMiniCarrito } from '../animations/miniCarrito.animations.js';

const MAX_CANTIDAD_POR_PRODUCTO = 99;

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function normalizarCantidad(valor) {
  const cantidad = Number.parseInt(valor, 10);
  if (!Number.isFinite(cantidad) || cantidad < 1) {
    return 1;
  }

  return Math.min(cantidad, MAX_CANTIDAD_POR_PRODUCTO);
}

// --- Funciones globales para el mini carrito ---
export function agregarAlCarrito(producto) {
  const existe = carrito.find(item => item.id === producto.id);
  if (existe) {
    if (existe.cantidad >= MAX_CANTIDAD_POR_PRODUCTO) {
      mostrarFeedbackMiniCarrito(`Máximo ${MAX_CANTIDAD_POR_PRODUCTO} unidades por producto`);
      renderMiniCarritoEnDOM({ action: 'limit', productId: producto.id });
      return;
    }

    existe.cantidad += 1;
    renderMiniCarritoEnDOM({ action: 'increase', productId: producto.id });
    guardarCarritoEnLocalStorage();
    mostrarFeedbackMiniCarrito(`+1 ${producto.nombre}`);
  } else {
    carrito.push({ ...producto, cantidad: 1 });
    renderMiniCarritoEnDOM({ action: 'add', productId: producto.id });
    guardarCarritoEnLocalStorage();
    mostrarFeedbackMiniCarrito(`${producto.nombre} agregado`);
  }
}

export function eliminarDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    const nombre = carrito[index].nombre || carrito[index].name || 'Producto';
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad -= 1;
      guardarCarritoEnLocalStorage();
      renderMiniCarritoEnDOM({ action: 'decrease', productId: id });
      mostrarFeedbackMiniCarrito(`-1 ${nombre}`);
    } else {
      carrito.splice(index, 1);
      guardarCarritoEnLocalStorage();
      renderMiniCarritoEnDOM();
      mostrarFeedbackMiniCarrito(`${nombre} eliminado`);
    }
  }
}

function aumentarCantidadEnCarrito(id) {
  const item = carrito.find(producto => producto.id === id);
  if (!item) return;

  if ((item.cantidad || 1) >= MAX_CANTIDAD_POR_PRODUCTO) {
    mostrarFeedbackMiniCarrito(`Máximo ${MAX_CANTIDAD_POR_PRODUCTO} unidades por producto`);
    renderMiniCarritoEnDOM({ action: 'limit', productId: id });
    return;
  }

  item.cantidad = (item.cantidad || 1) + 1;
  guardarCarritoEnLocalStorage();
  renderMiniCarritoEnDOM({ action: 'increase', productId: id });
  mostrarFeedbackMiniCarrito(`+1 ${item.nombre || item.name || 'Producto'}`);
}

function quitarProductoDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);
  if (index === -1) return;
  const nombre = carrito[index].nombre || carrito[index].name || 'Producto';
  carrito.splice(index, 1);
  guardarCarritoEnLocalStorage();
  renderMiniCarritoEnDOM();
  mostrarFeedbackMiniCarrito(`${nombre} eliminado`);
}

function actualizarCantidadManual(idx, valor) {
  const item = carrito[idx];
  if (!item) return;

  const nuevaCantidad = normalizarCantidad(valor);

  if (item.cantidad === nuevaCantidad) return;

  if (Number.parseInt(valor, 10) > MAX_CANTIDAD_POR_PRODUCTO) {
    mostrarFeedbackMiniCarrito(`Máximo ${MAX_CANTIDAD_POR_PRODUCTO} unidades por producto`);
  }

  item.cantidad = nuevaCantidad;
  guardarCarritoEnLocalStorage();
  renderMiniCarritoEnDOM({ action: 'manual', productId: item.id });
}

function vaciarCarrito() {
  carrito = [];
  guardarCarritoEnLocalStorage();
  renderMiniCarritoEnDOM();
  mostrarFeedbackMiniCarrito('Carrito vaciado');
}

export function renderMiniCarritoEnDOM(options = {}) {
  const miniCarritoContainer = document.getElementById('mini-carrito-container');
  if (miniCarritoContainer) {
    miniCarritoContainer.innerHTML = renderMiniCarrito(carrito);
    animarMiniCarrito();
    animarAccionMiniCarrito(options);

    // Boton eliminar item (quitar por completo)
    document.querySelectorAll('.btn-eliminar-carrito').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        quitarProductoDelCarrito(id);
      });
    });

    // Botones de cantidad
    document.querySelectorAll('.btn-mini-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        aumentarCantidadEnCarrito(id);
      });
    });

    document.querySelectorAll('.btn-mini-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        eliminarDelCarrito(id);
      });
    });

    const btnVaciar = document.getElementById('vaciar-carrito-btn');
    if (btnVaciar) {
      btnVaciar.addEventListener('click', async () => {
        if (carrito.length === 0) return;

        const result = await Swal.fire({
          title: 'Vaciar carrito',
          text: 'Se eliminaran todos los productos seleccionados.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, vaciar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          vaciarCarrito();
        }
      });
    }

    // Boton ver carrito
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

    const btnIrProductos = document.getElementById('ir-productos-btn');
    if (btnIrProductos) {
      btnIrProductos.addEventListener('click', () => {
        window.location.href = 'producto.html';
      });
    }

    const btnSeguirComprando = document.getElementById('seguir-comprando-btn');
    if (btnSeguirComprando) {
      btnSeguirComprando.addEventListener('click', () => {
        window.location.href = 'producto.html';
      });
    }

    // Confirmar compra
const btnConfirmar = document.getElementById("confirmar-btn");
if (btnConfirmar) {
  btnConfirmar.addEventListener("click", async function () {
    const confirmacion = await Swal.fire({
      title: '¿Finalizar compra?',
      text: '¿Estás seguro de que deseas confirmar tu pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    const nombre_usuario = localStorage.getItem('nombre_usuario') || localStorage.getItem('nombreCliente') || 'Invitado';
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

      // Sólo proceder si el servidor confirma la creación (201) o responde OK
      if (response.ok && (response.status === 201 || response.status === 200)) {
        // Guarda los datos del ticket ANTES de limpiar el carrito
        const ticketData = {
          carrito: [...carrito],
          total,
          fecha: new Date().toISOString(),
          nombre_usuario
        };
        localStorage.setItem('ultimo_ticket', JSON.stringify(ticketData));

        // Confirmación visual al usuario
        await Swal.fire({
          title: '¡Éxito!',
          text: '¡Compra confirmada!',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Limpiar el carrito localmente SOLO después de la confirmación
        carrito = [];
        localStorage.removeItem('carrito');

        // Redirigir a la pantalla de ticket
        window.location.href = '/ticket.html';
      } else {
        // No borrar el carrito: mostrar mensaje de error con detalle si existe
        let msg = 'Intenta de nuevo';
        try {
          const json = await response.json();
          msg = json.error || json.msg || msg;
        } catch (e) {
          // ignore JSON parse errors
        }
        Swal.fire({
          title: 'Error',
          text: 'Error al registrar la venta: ' + msg,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (err) {
      // Error de red o excepción: NO BORRAR carrito
      console.error('Error enviando venta:', err);
      Swal.fire({
        title: 'Error de conexión',
        text: 'Error de conexión al registrar la venta. Verificá tu conexión y reintentá.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
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
          Swal.fire({
            title: '¿Eliminar producto?',
            text: `¿Seguro que deseas eliminar ${nombre} del carrito?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              carrito.splice(idx, 1);
              guardarYActualizar();
            }
          });
        }
      });
    });

    container.querySelectorAll(".cart-qty-input").forEach(input => {
      const aplicarCantidad = () => {
        const idx = parseInt(input.getAttribute("data-idx"), 10);
        actualizarCantidadManual(idx, input.value);
        input.value = carrito[idx]?.cantidad || 1;
        renderizar();
      };

      input.addEventListener("change", aplicarCantidad);
      input.addEventListener("blur", aplicarCantidad);
      input.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          aplicarCantidad();
        }
      });
    });

    // Eliminar producto
    container.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-idx"));
        const nombre = carrito[idx].nombre || carrito[idx].name || "este producto";
        Swal.fire({
          title: '¿Eliminar producto?',
          text: `¿Seguro que deseas eliminar ${nombre} del carrito?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            carrito.splice(idx, 1);
            guardarYActualizar();
          }
        });
      });
    });
  }

  renderizar();
}