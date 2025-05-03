const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registro de novo usuário
const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [usuariosExistentes] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);

    return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao registrar usuário.', error });
  }
};

// Login do usuário
const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [usuarios] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const usuario = usuarios[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.status(200).json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao fazer login.', error });
  }
};

module.exports = {
  register,
  login
};
