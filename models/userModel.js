const { db } = require('../config/db');

/////////////////////////////////////////////////////////////////////////////////////////////
// Lógica para criar um usuário
/////////////////////////////////////////////////////////////////////////////////////////////
async function createUser(data) {
  const { nome, email, senha, cpf, telefone, endereco, nivel, matricula } = data;
  const sql = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, nivel, matricula) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  return db.query(sql, [nome, email, senha, cpf, telefone, endereco, nivel, matricula]);
}

async function findUserByEmail(email) {
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  const [results] = await db.query(sql, [email]);
  return results[0]; // Retorna o primeiro usuário encontrado
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Lógica para atualizar o perfil do usuário
/////////////////////////////////////////////////////////////////////////////////////////////
async function updateProfile(userId, data) {
  const { nome, email, matricula, telefone, endereco } = data;
  const sql = 'UPDATE usuarios SET nome = ?, email = ?, matricula = ?, telefone = ?, endereco = ? WHERE id = ?';
  return db.query(sql, [nome, email, matricula, telefone, endereco, userId]);
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Lógica para obter todos os usuários
/////////////////////////////////////////////////////////////////////////////////////////////
async function getAllUsers() {
  const sql = 'SELECT * FROM usuarios';
  const [results] = await db.query(sql);
  return results; // Retorna todos os usuários
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Lógica para deletar um usuário
/////////////////////////////////////////////////////////////////////////////////////////////
async function deleteUser(userId) {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  return db.query(sql, [userId]);
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Exportando todas as funções necessárias
/////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  createUser,
  findUserByEmail,
  updateProfile,
  getAllUsers,
  deleteUser,
};
