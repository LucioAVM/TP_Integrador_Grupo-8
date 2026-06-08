import { getClientNavLinks } from './navbar.js';

export function renderHeader(path = '') {
  const links = getClientNavLinks(path);

  return `
    <div class="client-header">
      <div class="container py-2 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <a href="/" class="d-flex align-items-center text-decoration-none text-reset">
            <img src="/assets/img/favicon.png" alt="Logo Fenrir 3D" width="48" height="48" class="me-2" />
            <span class="brand-name">Fenrir 3D</span>
          </a>
        </div>
        <div class="text-end d-none d-md-block alumnos-line">
          <span class="fw-semibold">Alumnos:</span>
          <span>Monsalbo Lucio</span>
        </div>
        <div>
          <button id="toggle-theme-btn" class="btn btn-outline-secondary fenrir-theme-btn ms-2" type="button" title="Cambiar modo" aria-label="Cambiar tema">
            <i class="bi bi-moon-stars-fill"></i>
          </button>
        </div>
      </div>
      <div class="fenrir-accent-line"></div>
      <nav class="client-navbar border-top">
        <div class="container">
          <ul class="nav justify-content-center gap-2 py-2 flex-wrap">
            ${links.map((link) => `
              <li class="nav-item">
                <a class="nav-link client-nav-link px-3 ${link.active}" href="${link.href}">${link.label}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      </nav>
    </div>
  `;
}
