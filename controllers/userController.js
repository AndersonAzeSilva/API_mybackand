const bcrypt = require('bcrypt');
const { query } = require('../models/db');
const { log } = require('../middlewares/logger');

async function registerUser(req, res) {
  const { nome, email, senha, cpf, telefone, endereco, isAdmin } = req.body;

  if (!nome || !email || !senha || !cpf || !telefone || !endereco) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const nivelUsuario = isAdmin ? 1 : 2;
    const sql = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, nivel) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await query(sql, [nome, email, hashedSenha, cpf, telefone, endereco, nivelUsuario]);
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    log(`Erro ao registrar usuário: ${error.message}`);
    res.status(500).json({ error: 'Erro ao registrar usuário no banco de dados.' });
  }
}

async function loginUser(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    const [results] = await query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const isAdmin = user.nivel === 1;
    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        isAdmin,
      },
    });
  } catch (err) {
    log(`Erro ao acessar o banco de dados: ${err.message}`);
    res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
  }
}

module.exports = { registerUser, loginUser };
