import { agregarAlCarrito, validarInputCantidad } from '../carrito/carrito.js';
import { renderProductoDetallePanel } from './productoDetalleView.js';

const MODAL_ID = 'producto-detalle-modal';
const BODY_ID = 'producto-detalle-modal-body';
let modalInstance = null;
let productoActual = null;

function renderModalShell() {
  return `
    <div class="modal fade" id="${MODAL_ID}" tabindex="-1" aria-labelledby="producto-detalle-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content fenrir-detalle-modal-shell">
          <div class="modal-body p-0" id="${BODY_ID}"></div>
        </div>
      </div>
    </div>
  `;
}

function bindCarritoListeners() {
  const cantidadEl = document.getElementById('input-cantidad');

  const validarCantidadEnInput = () => {
    validarInputCantidad(cantidadEl);
  };

  cantidadEl?.addEventListener('blur', validarCantidadEnInput);
  cantidadEl?.addEventListener('change', validarCantidadEnInput);

  document.getElementById('btn-add-carrito')?.addEventListener('click', () => {
    if (!productoActual) return;

    const parsed = validarInputCantidad(cantidadEl);
    if (!parsed || parsed.bloquear) {
      return;
    }

    agregarAlCarrito({ ...productoActual, cantidad: parsed.cantidad });
    modalInstance?.hide();
  });
}

function ensureModalInDOM() {
  if (document.getElementById(MODAL_ID)) {
    return;
  }

  const root = document.getElementById('producto-detalle-modal-root');
  if (!root) {
    return;
  }

  root.innerHTML = renderModalShell();

  const modalEl = document.getElementById(MODAL_ID);
  if (modalEl && window.bootstrap?.Modal) {
    modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modalEl.addEventListener('hidden.bs.modal', () => {
      productoActual = null;
      const body = document.getElementById(BODY_ID);
      if (body) body.innerHTML = '';
    });
  }
}

export function openProductoDetalleModal(producto) {
  if (!producto) return;

  ensureModalInDOM();

  const modalEl = document.getElementById(MODAL_ID);
  const body = document.getElementById(BODY_ID);
  if (!modalEl || !body || !window.bootstrap?.Modal) {
    return;
  }

  productoActual = producto;
  body.innerHTML = renderProductoDetallePanel(producto, { modal: true });
  bindCarritoListeners();

  if (!modalInstance) {
    modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
  }

  modalInstance.show();
}

export function initProductoDetalleModalRoot() {
  ensureModalInDOM();
}
