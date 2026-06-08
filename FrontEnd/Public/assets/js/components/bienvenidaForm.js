export function renderBienvenidaForm() {
  return `
    <div class="fenrir-panel bienvenida-card">
      <a
        href="/login"
        class="admin-access-link"
        title="Acceso administrador"
        aria-label="Acceso administrador"
      >
        <i class="bi bi-shield-lock"></i> admin
      </a>
      <div class="fenrir-panel-body">
        <img src="/assets/img/favicon.png" alt="Fenrir 3D" class="bienvenida-hero-logo" />
        <p class="fenrir-eyebrow text-center mb-1">Autoservicio</p>
        <h2 class="bienvenida-title">Fenrir 3D</h2>
        <p class="bienvenida-tagline">Insumos e impresoras 3D — ingresá tu nombre para comenzar</p>
        <form id="form-bienvenida">
          <div class="mb-3">
            <label for="nombre" class="form-label">Tu nombre</label>
            <input type="text" class="form-control fenrir-input" id="nombre" placeholder="Ej: Lucio" required />
          </div>
          <button type="submit" class="btn btn-primary btn-fenrir-primary w-100">
            <i class="bi bi-arrow-right-circle me-1"></i> Continuar
          </button>
        </form>
      </div>
    </div>
  `;
}
