export async function getProductos() {
  const response = await fetch('/api/productos');
  if (!response.ok) throw new Error('Error al obtener productos');
  return await response.json();
}