export async function getProductos() {
  const res = await fetch('/assets/data/productos.json');
  return res.json();
}