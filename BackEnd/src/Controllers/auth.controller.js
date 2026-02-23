import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const [user] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (user.length) return res.status(400).json({ msg: 'Usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hash]);
    res.status(201).json({ msg: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error en registro' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!user.length) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const payload = { user: { id: user[0].id, nombre: user[0].nombre } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto', { expiresIn: '8h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
};

export default { register, login };