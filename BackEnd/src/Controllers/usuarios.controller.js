import bcrypt from 'bcryptjs';
import Admin from '../Models/admin.js';

export async function crearUsuario(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Admin.findOne({ where: { email: email.trim() } });
    if (existe) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(String(password), 10);
    const admin = await Admin.create({
      nombre: nombre.trim(),
      email: email.trim(),
      password: hash,
    });

    res.status(201).json({
      id: admin.id,
      nombre: admin.nombre,
      email: admin.email,
      mensaje: 'Administrador creado exitosamente',
    });
  } catch (err) {
    console.error('Error API POST /api/usuarios:', err);
    res.status(500).json({ error: 'Error al crear el administrador' });
  }
}

export default { crearUsuario };
