import { tieneNombreUsuario, tieneTicket } from '../utils/session.js';

const NAV_ICONS = {
  Inicio: 'bi-house-door',
  Productos: 'bi-grid-3x3-gap',
  Carrito: 'bi-cart3',
  Ticket: 'bi-receipt',
};

function navLabel(label) {
  const icon = NAV_ICONS[label] || 'bi-circle';
  return `<i class="bi ${icon}"></i>${label}`;
}

export function getClientNavLinks(path = '') {
  const isInicio = path === '/' || path.endsWith('index.html');
  const isProductos = path.endsWith('producto.html') || path.includes('producto_detalle');
  const hasName = tieneNombreUsuario();

  if (isInicio) {
    return [{ href: '/', label: navLabel('Inicio'), active: 'active' }];
  }

  const links = [{ href: '/', label: navLabel('Inicio'), active: '' }];

  if (hasName) {
    links.push(
      { href: '/producto.html', label: navLabel('Productos'), active: isProductos ? 'active' : '' },
      { href: '/carrito.html', label: navLabel('Carrito'), active: path.endsWith('carrito.html') ? 'active' : '' },
    );
  }

  if (tieneTicket()) {
    links.push({
      href: '/ticket.html',
      label: navLabel('Ticket'),
      active: path.endsWith('ticket.html') ? 'active' : '',
    });
  }

  return links;
}
