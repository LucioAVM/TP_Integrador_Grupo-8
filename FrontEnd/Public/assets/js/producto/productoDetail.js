import { agregarAlCarrito } from '../carrito/carrito.js';

export function initProductoDetalle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('producto-detalle-container');
  if (!id || !container) return;

  fetch(`/api/productos/${encodeURIComponent(id)}`)
    .then(res => {
      if (!res.ok) throw new Error('Producto no encontrado');
      return res.json();
    })
    .then(producto => {
      container.innerHTML = renderDetail(producto);
      document.getElementById('btn-add-carrito')?.addEventListener('click', () => {
        const cantidadEl = document.getElementById('input-cantidad');
        const cantidad = Number(cantidadEl?.value || 1);
        agregarAlCarrito({ ...producto, cantidad });
      });
    })
    .catch(err => {
      console.error('Error cargando detalle:', err);
      container.innerHTML = `<div class="alert alert-danger">No se pudo cargar el producto.</div>`;
    });
}

function renderDetail(p) {
  return `
    <div class="row">
      <div class="col-md-5">
        <img src="${p.imagen}" class="img-fluid" alt="${p.nombre}" />
      </div>
      <div class="col-md-7 text-white">
        <h2>${p.nombre}</h2>
        <p>${p.descripcion || ''}</p>
        <h4>$${p.precio}</h4>
        <div class="d-flex align-items-center gap-2 mb-3">
          <input id="input-cantidad" type="number" min="1" value="1" class="form-control" style="width:100px;" />
          <button id="btn-add-carrito" class="btn btn-primary">Agregar al carrito</button>
          <a href="/producto.html" class="btn btn-outline-light">Volver al catálogo</a>
        </div>
      </div>
    </div>
  `;
}
