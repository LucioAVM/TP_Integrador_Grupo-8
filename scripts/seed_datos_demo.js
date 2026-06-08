/**
 * Carga datos de demostración para registros, asistencia y top productos.
 * Uso: node scripts/seed_datos_demo.js
 *
 * Requiere: servidor/BD configurada en .env (misma config que server.js)
 */
import 'dotenv/config';
import sequelize from '../BackEnd/src/config/db.js';
import Producto from '../BackEnd/src/Models/producto.js';
import Venta from '../BackEnd/src/Models/venta.js';
import VentaProducto from '../BackEnd/src/Models/venta_productos.js';
import Encuesta from '../BackEnd/src/Models/Encuesta.js';
import Log from '../BackEnd/src/Models/log.js';
import Admin from '../BackEnd/src/Models/admin.js';

async function seed() {
  await sequelize.authenticate();
  console.log('Conexión OK');

  const productos = await Producto.findAll({ where: { activo: true }, limit: 8 });
  if (productos.length < 2) {
    console.error('Necesitás al menos 2 productos activos en la BD antes de ejecutar el seed.');
    process.exit(1);
  }

  const ventasDemo = [
    { nombre_usuario: 'Lucas', total: 12500.50, items: [{ idx: 0, cantidad: 3 }, { idx: 1, cantidad: 1 }] },
    { nombre_usuario: 'María', total: 8900.00, items: [{ idx: 2, cantidad: 2 }] },
    { nombre_usuario: 'Pedro', total: 45200.75, items: [{ idx: 0, cantidad: 5 }, { idx: 3, cantidad: 2 }] },
    { nombre_usuario: 'Ana', total: 3200.00, items: [{ idx: 1, cantidad: 4 }] },
    { nombre_usuario: 'Jorge', total: 15800.25, items: [{ idx: 4, cantidad: 1 }, { idx: 2, cantidad: 3 }] },
  ];

  for (const demo of ventasDemo) {
    const venta = await Venta.create({
      nombre_usuario: demo.nombre_usuario,
      total: demo.total,
    });

    await VentaProducto.bulkCreate(
      demo.items.map((item) => {
        const producto = productos[item.idx % productos.length];
        return {
          venta_id: venta.id,
          producto_id: producto.id,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
        };
      })
    );
  }
  console.log(`Ventas demo creadas: ${ventasDemo.length}`);

  const encuestasDemo = [
    { puntuacion: 5, email: 'cliente1@mail.com', comentario: 'Excelente servicio', terminos: true },
    { puntuacion: 2, email: 'cliente2@mail.com', comentario: 'Demora en la entrega', terminos: true },
    { puntuacion: 4, email: 'cliente3@mail.com', comentario: 'Muy buena atención', terminos: true },
    { puntuacion: 1, email: 'cliente4@mail.com', comentario: 'Producto dañado', terminos: true },
    { puntuacion: 3, email: 'cliente5@mail.com', comentario: 'Regular', terminos: true },
  ];

  for (const enc of encuestasDemo) {
    await Encuesta.create(enc);
  }
  console.log(`Encuestas demo creadas: ${encuestasDemo.length}`);

  const admin = await Admin.findOne();
  if (admin) {
    await Log.create({
      adminId: admin.id,
      email: admin.email,
      mensaje: JSON.stringify({ adminId: admin.id, email: admin.email, demo: true }),
    });
    console.log('Log de demo creado');
  }

  console.log('Seed completado. Revisá /registros y /asistencia.');
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
