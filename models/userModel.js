const initializeDb = require('../config/db');

async function createUser(user) {
  const db = await initializeDb();
  const { nome, email, senha, cpf, telefone, endereco, nivel } = user;
  const query = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, nivel) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await db.query(query, [nome, email, senha, cpf, telefone, endereco, nivel]);
}

async function getUserByEmail(email) {
  const db = await initializeDb();
  const [result] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return result.length ? result[0] : null;
}

// Outras funções do modelo de usuário

module.exports = {
  createUser,
  getUserByEmail,
};
