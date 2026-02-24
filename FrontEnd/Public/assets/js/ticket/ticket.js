import { renderTicket } from '../components/ticket.js';

export function initTicket() {
  const container = document.getElementById('ticket-container');
  // Lee los datos del último ticket guardado antes de limpiar el carrito
  const ticketData = JSON.parse(localStorage.getItem('ultimo_ticket'));
  
  if (!ticketData) {
    container.innerHTML = '<p class="text-light text-center">No hay ticket para mostrar.</p>';
    return;
  }
  
  const { carrito, total, fecha, nombre_usuario } = ticketData;

  const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Renderizamos el HTML del ticket
  container.innerHTML = renderTicket(carrito, total, fechaFormateada, nombre_usuario);

  // Escuchamos el clic del botón PDF
  const btnPdf = document.getElementById('btn-descargar-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      generarPDF(carrito, total, fechaFormateada, nombre_usuario);
    });
  }
}

function generarPDF(carrito, total, fecha, nombre_usuario) {
    // Inicializamos jsPDF (usando window para evitar errores de importación local)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Fenrir 3D", 105, 20, null, null, "center");
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Ticket de Compra", 105, 28, null, null, "center");

    // Datos de la compra
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 20, 45);
    doc.text(`Cliente: ${nombre_usuario || 'Consumidor Final'}`, 20, 52);

    // Cabecera de la tabla
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Producto", 20, y);
    doc.text("Cant.", 120, y);
    doc.text("Precio", 145, y);
    doc.text("Subtotal", 170, y);

    // Línea separadora
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    // Listado de productos
    doc.setFont("helvetica", "normal");
    carrito.forEach(item => {
        const nombre = item.name ?? item.nombre ?? 'Producto';
        const cantidad = item.quantity ?? item.cantidad ?? 1;
        const precio = item.price ?? item.precio ?? 0;
        const subtotal = cantidad * precio;

        // Si el nombre del filamento o máquina es muy largo, lo cortamos
        doc.text(nombre.substring(0, 35), 20, y); 
        doc.text(cantidad.toString(), 122, y);
        doc.text(`$${precio.toFixed(2)}`, 145, y);
        doc.text(`$${subtotal.toFixed(2)}`, 170, y);
        y += 8;
    });

    // Total final
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 145, y);

    // Guardar el archivo en la compu del usuario
    doc.save("Ticket Fenrir 3D.pdf");
}