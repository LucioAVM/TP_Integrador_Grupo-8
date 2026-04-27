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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 14;
    const tableX = marginX;
    const tableWidth = pageWidth - marginX * 2;

    const cols = {
      producto: 92,
      cantidad: 20,
      precio: 34,
      subtotal: 34
    };

    const money = (v) => `$${Number(v || 0).toFixed(2)}`;
    const cliente = nombre_usuario || 'Consumidor Final';
    const fechaEmision = fecha || new Date().toLocaleString('es-AR');

    let y = 14;

    // Encabezado principal
    doc.setFillColor(20, 43, 78);
    doc.roundedRect(tableX, y, tableWidth, 20, 2, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('FENRIR 3D', tableX + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Ticket de compra', tableX + 6, y + 14);
    doc.text(`Emitido: ${fechaEmision}`, tableX + tableWidth - 6, y + 8, { align: 'right' });
    doc.text(`Cliente: ${cliente}`, tableX + tableWidth - 6, y + 14, { align: 'right' });

    y += 28;

    // Cabecera de tabla
    const drawTableHeader = () => {
      doc.setFillColor(234, 241, 252);
      doc.rect(tableX, y, tableWidth, 9, 'F');

      doc.setTextColor(22, 33, 52);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);

      doc.text('Producto', tableX + 3, y + 6);
      doc.text('Cant.', tableX + cols.producto + cols.cantidad - 3, y + 6, { align: 'right' });
      doc.text('Precio Unit.', tableX + cols.producto + cols.cantidad + cols.precio - 3, y + 6, { align: 'right' });
      doc.text('Subtotal', tableX + tableWidth - 3, y + 6, { align: 'right' });

      y += 9;
    };

    const ensureSpace = (heightNeeded) => {
      if (y + heightNeeded > pageHeight - 28) {
        doc.addPage();
        y = 14;
        drawTableHeader();
      }
    };

    drawTableHeader();

    // Filas
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(23, 33, 48);

    let rowIndex = 0;
    carrito.forEach((item) => {
      const nombre = item.name ?? item.nombre ?? 'Producto';
      const cantidad = Number(item.quantity ?? item.cantidad ?? 1);
      const precio = Number(item.price ?? item.precio ?? 0);
      const subtotal = cantidad * precio;

      const lines = doc.splitTextToSize(String(nombre), cols.producto - 6);
      const rowHeight = Math.max(8, lines.length * 4.4 + 3.2);

      ensureSpace(rowHeight);

      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 250, 254);
        doc.rect(tableX, y, tableWidth, rowHeight, 'F');
      }

      doc.text(lines, tableX + 3, y + 5.2);
      doc.text(String(cantidad), tableX + cols.producto + cols.cantidad - 3, y + 5.2, { align: 'right' });
      doc.text(money(precio), tableX + cols.producto + cols.cantidad + cols.precio - 3, y + 5.2, { align: 'right' });
      doc.text(money(subtotal), tableX + tableWidth - 3, y + 5.2, { align: 'right' });

      doc.setDrawColor(222, 228, 238);
      doc.line(tableX, y + rowHeight, tableX + tableWidth, y + rowHeight);

      y += rowHeight;
      rowIndex += 1;
    });

    // Bloque total
    y += 6;
    ensureSpace(18);

    doc.setFillColor(20, 43, 78);
    doc.roundedRect(tableX + tableWidth - 72, y, 72, 14, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', tableX + tableWidth - 68, y + 9);
    doc.text(money(total), tableX + tableWidth - 4, y + 9, { align: 'right' });

    // Pie de página
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(78, 90, 112);
    doc.text('Gracias por tu compra en Fenrir 3D', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save('Ticket_Fenrir3D.pdf');
}