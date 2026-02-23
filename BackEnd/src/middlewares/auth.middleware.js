// Middleware compartido para autenticación de admin (sesión) y verificación JWT
import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  if (!req.session?.adminId) {
    return res.redirect('/login');
  }
  next();
}

export function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
}

export default { requireAdmin, verifyToken };