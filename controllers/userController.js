const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Função de registro de usuário
async function registerUser(req, res) {
  const { nome, email, senha, cpf, telefone, endereco, isAdmin } = req.body;

  // Validação de dados
  if (!nome || !email || !senha || !cpf || !telefone || !endereco) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const nivel = isAdmin ? 1 : 2;
    await userModel.createUser({ nome, email, senha: hashedSenha, cpf, telefone, endereco, nivel });
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário no banco de dados.' });
  }
}

// Função de login
async function loginUser(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        isAdmin: user.nivel === 1,
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
  }
}

module.exports = {
  registerUser,
  loginUser
};
