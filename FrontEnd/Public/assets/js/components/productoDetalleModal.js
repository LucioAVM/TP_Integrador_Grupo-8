import { agregarAlCarrito } from '../carrito/carrito.js';

const MODAL_ID = 'producto-detalle-modal';
let modalInstance = null;
let productoActual = null;

function renderModalMarkup() {
  return `
    <div class="modal fade" id="${MODAL_ID}" tabindex="-1" aria-labelledby="${MODAL_ID}-label" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content detalle-modal-content">
          <div class="modal-header border-0 pb-0">
            <p class="fenrir-eyebrow mb-0" id="modal-producto-meta"></p>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body pt-2">
            <div class="row g-4 align-items-start">
              <div class="col-md-5">
                <div class="detalle-img-wrap">
                  <img id="modal-producto-img" class="detalle-img" src="" alt="" />
                </div>
              </div>
              <div class="col-md-7">
                <h2 class="detalle-title" id="${MODAL_ID}-label"></h2>
                <p class="detalle-desc" id="modal-producto-desc"></p>
                <p class="fenrir-price mb-3" id="modal-producto-precio"></p>
                <div class="detalle-actions">
                  <label class="visually-hidden" for="modal-input-cantidad">Cantidad</label>
                  <input
                    id="modal-input-cantidad"
                    type="number"
                    min="1"
                    max="99"
                    value="1"
                    class="form-control detalle-qty"
                  />
                  <button type="button" id="modal-btn-add-carrito" class="btn btn-primary btn-fenrir-primary">
                    <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ensureModalInDOM() {
  if (document.getElementById(MODAL_ID)) {
    return;
  }

  const root = document.getElementById('producto-detalle-modal-root');
  if (!root) {
    return;
  }

  root.innerHTML = renderModalMarkup();

  document.getElementById('modal-btn-add-carrito')?.addEventListener('click', () => {
    if (!productoActual) return;

    const cantidadEl = document.getElementById('modal-input-cantidad');
    const cantidad = Number(cantidadEl?.value || 1);
    agregarAlCarrito({ ...productoActual, cantidad });
    modalInstance?.hide();
  });

  const modalEl = document.getElementById(MODAL_ID);
  if (modalEl && window.bootstrap?.Modal) {
    modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modalEl.addEventListener('hidden.bs.modal', () => {
      productoActual = null;
      const cantidadEl = document.getElementById('modal-input-cantidad');
      if (cantidadEl) cantidadEl.value = '1';
    });
  }
}

function fillModal(producto) {
  productoActual = producto;

  const meta = document.getElementById('modal-producto-meta');
  const img = document.getElementById('modal-producto-img');
  const title = document.getElementById(`${MODAL_ID}-label`);
  const desc = document.getElementById('modal-producto-desc');
  const precio = document.getElementById('modal-producto-precio');
  const cantidadEl = document.getElementById('modal-input-cantidad');

  if (meta) {
    meta.textContent = `${producto.categoria || 'Producto'} · ${producto.tipo || ''}`.trim();
  }
  if (img) {
    img.src = producto.imagen || '';
    img.alt = producto.nombre || 'Producto';
  }
  if (title) title.textContent = producto.nombre || 'Producto';
  if (desc) desc.textContent = producto.descripcion || '';
  if (precio) precio.textContent = `$${producto.precio}`;
  if (cantidadEl) cantidadEl.value = '1';
}

export function openProductoDetalleModal(producto) {
  if (!producto) return;

  ensureModalInDOM();

  const modalEl = document.getElementById(MODAL_ID);
  if (!modalEl || !window.bootstrap?.Modal) {
    return;
  }

  fillModal(producto);

  if (!modalInstance) {
    modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
  }

  modalInstance.show();
}

export function initProductoDetalleModalRoot() {
  ensureModalInDOM();
}
