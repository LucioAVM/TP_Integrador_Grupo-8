export function renderFiltros(categorias, tipos) {
  return `
    <div class="card mb-3">
      <div class="card-header fw-bold">Filtrar por categoría</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <input type="radio" name="categoria" value="todas" id="cat-todas" checked>
          <label for="cat-todas">Todas</label>
        </li>
        ${categorias.map(cat => `
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
        ${tipos.map(tipo => `
        <li class="list-group-item">
          <input type="radio" name="tipo" value="${tipo}" id="tipo-${tipo}">
          <label for="tipo-${tipo}">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</label>
        </li>
        `).join('')}
      </ul>
    </div>
  `;
}