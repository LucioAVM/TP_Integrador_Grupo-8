export function renderNavbar() {
  return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">Inicio</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="producto.html">Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
            <li class="nav-item"><a class="nav-link" href="ticket.html">Ticket</a></li>
            <li class="nav-item">
              <a class="nav-link" href="#">Login Admin</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
}