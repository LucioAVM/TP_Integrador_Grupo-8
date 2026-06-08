import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../BackEnd/src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, 'seed_datos_historicos.sql');

const raw = fs.readFileSync(sqlPath, 'utf8');
const body = raw.split('-- ===== Verificación rápida =====')[0];
const withoutBlockComments = body.replace(/\/\*[\s\S]*?\*\//g, '');
const withoutLineComments = withoutBlockComments
  .split('\n')
  .map((line) => line.replace(/--.*$/, ''))
  .join('\n');
const statements = withoutLineComments
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

await sequelize.authenticate();

for (const statement of statements) {
  await sequelize.query(statement);
}

const [meses] = await sequelize.query(`
  SELECT CONVERT(VARCHAR(7), fecha, 120) AS mes, COUNT(*) AS ventas
  FROM ventas
  WHERE nombre_usuario IN (
    'Carlos','Valentina','Mateo','Sofía','Diego','Luciana',
    'Tomás','Camila','Bruno','Agustina','Nicolás','Florencia','Renata','Julián','Micaela'
  )
  GROUP BY CONVERT(VARCHAR(7), fecha, 120)
  ORDER BY mes
`);

const [encuestas] = await sequelize.query(`
  SELECT COUNT(*) AS total FROM encuestas WHERE email LIKE '%@fenrir3d.demo'
`);

console.log('Ventas históricas por mes:', meses);
console.log('Encuestas vinculadas (@fenrir3d.demo):', encuestas[0]?.total);
await sequelize.close();
