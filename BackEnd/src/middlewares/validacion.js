export function validarUsuario(req, res, next) {
  const { nombre, email, password } = req.body;
  const errores = [];

  if (!nombre?.trim()) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errores.push({ campo: 'email', mensaje: 'Email inválido' });
  }
  if (!password || String(password).length < 6) {
    errores.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if (errores.length) {
    return res.status(400).json({ errores });
  }

  next();
}
