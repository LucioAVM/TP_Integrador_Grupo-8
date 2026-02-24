function buildQuery(params) {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
}

export async function getProductos({ page = 1, limit = 6, q = null, categoria = null, tipo = null } = {}) {
  const query = buildQuery({ page, limit, q, categoria, tipo });
  const response = await fetch(`/api/productos?${query}`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return await response.json();
}

export async function getFiltros() {
  const response = await fetch('/api/productos/filters');
  if (!response.ok) throw new Error('Error al obtener filtros');
  return await response.json();
}