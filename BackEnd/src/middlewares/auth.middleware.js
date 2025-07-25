const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};