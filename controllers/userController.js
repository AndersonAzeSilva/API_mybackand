const userModel = require('../models/userModel');

/////////////////////////////////////////////////////////////////////////////////////////////
// Função para registrar um usuário
/////////////////////////////////////////////////////////////////////////////////////////////
async function registerUser(req, res) {
  try {
    const userData = req.body;
    const result = await userModel.createUser(userData);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', result });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Função para atualizar o perfil do usuário
/////////////////////////////////////////////////////////////////////////////////////////////
async function updateProfile(req, res) {
  const userId = req.params.id;
  const data = req.body;
  try {
    const result = await userModel.updateProfile(userId, data);
    res.status(200).json({ message: 'Perfil atualizado com sucesso!', result });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Função para login
/////////////////////////////////////////////////////////////////////////////////////////////
async function loginUser(req, res) {
  const { email, senha } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (user && user.senha === senha) { // Adicione uma verificação mais segura para senhas
      res.status(200).json({ message: 'Login bem-sucedido!', user });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Função para obter todos os usuários
/////////////////////////////////////////////////////////////////////////////////////////////
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuários', error });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Função para deletar um usuário
/////////////////////////////////////////////////////////////////////////////////////////////
async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    await userModel.deleteUser(userId);
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
}

// Exportando as funções
module.exports = { 
  registerUser,
  updateProfile,
  loginUser,
  getAllUsers,
  deleteUser,
};
