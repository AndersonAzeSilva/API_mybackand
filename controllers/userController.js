const db = require('../utils/db');

exports.registerUser = async (req, res) => {
  const { nome, email, senha, nivel } = req.body;

  try {
    const [result] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (result.length) return res.status(400).json({ error: 'Usuário já existe' });

    const sql = 'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)';
    await db.query(sql, [nome, email, senha, nivel]);

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM usuarios');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};
