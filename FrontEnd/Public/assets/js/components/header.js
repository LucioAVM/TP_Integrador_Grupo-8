export function renderHeader() {
  return `
    <div class="container py-2 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <img src="/assets/img/favicon.png" alt="Logo" width="48" height="48" class="me-3" />
        <span class="fs-4 fw-bold">Fenrir 3D</span>
      </div>
      <div class="text-end">
        <span class="fw-semibold">Alumnos:</span>
        <span>Monsalbo Lucio, Rodrigo Vega</span>
      </div>
      <div>
        <button id="toggle-theme-btn" class="btn btn-outline-secondary ms-3" title="Cambiar modo">
          🌙
        </button>
      </div>
    </div>
  `;
}