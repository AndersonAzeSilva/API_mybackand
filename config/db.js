const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Coloque sua senha aqui
  database: 'appvozativa',
};

async function initializeDb() {
  try {
    const db = await mysql.createConnection(dbConfig);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return db;
  } catch (err) {
    console.error('Erro ao conectar no banco de dados: ', err);
    throw err;
  }
}

module.exports = initializeDb;
