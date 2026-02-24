export function renderFiltros(categorias, tipos) {
  // Mostrar categorías preferidas si existen (impresoras / insumos)
  const preferredCats = ['impresoras', 'insumos'];
  const availableCats = preferredCats.filter(c => categorias.includes(c));
  const catsToRender = availableCats.length ? availableCats : categorias;

  // Tipos preferidos (filamento / resina) si están presentes
  const preferredTipos = ['filamento', 'resina'];
  const availableTipos = preferredTipos.filter(t => tipos.includes(t));
  const tiposToRender = availableTipos.length ? availableTipos : tipos;

  return `
    <div class="card mb-3">
      <div class="card-header fw-bold">Filtrar por categoría</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <input type="radio" name="categoria" value="todas" id="cat-todas" checked>
          <label for="cat-todas">Todas</label>
        </li>
        ${catsToRender.map(cat => `
        <li class="list-group-item">
          <input type="radio" name="categoria" value="${cat}" id="cat-${cat}">
          <label for="cat-${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</label>
        </li>
        `).join('')}
      </ul>
    </div>
    <div class="card">
      <div class="card-header fw-bold">Filtrar por tipo</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <input type="radio" name="tipo" value="todos" id="tipo-todos" checked>
          <label for="tipo-todos">Todos</label>
        </li>
        ${tiposToRender.map(tipo => `
        <li class="list-group-item">
          <input type="radio" name="tipo" value="${tipo}" id="tipo-${tipo}">
          <label for="tipo-${tipo}">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</label>
        </li>
        `).join('')}
      </ul>
    </div>
  `;
}