export function renderBienvenidaForm() {
  return `
    <div class="card p-4 shadow bienvenida-card" style="min-width: 320px">
      <a
        href="/login"
        class="admin-access-link"
        title="Acceso administrador"
        aria-label="Acceso administrador"
      >
        admin
      </a>
      <h2 class="mb-3 text-center">¡Bienvenido!</h2>
      <form id="form-bienvenida">
        <div class="mb-3">
          <label for="nombre" class="form-label">Ingresa tu nombre:</label>
          <input type="text" class="form-control" id="nombre" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Continuar</button>
      </form>
    </div>
  `;
}