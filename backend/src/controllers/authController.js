import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: 'Usuario registrado correctamente',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  return res.status(200).json({
    message: 'Inicio de sesión exitoso',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}
