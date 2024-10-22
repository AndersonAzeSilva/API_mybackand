require('dotenv').config();
const mysql = require('mysql2/promise');
const { log } = require('../utils/logger');

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Configuração da conexão com o banco de dados
///////////////////////////////////////////////////////////////////////////////////////////////////////
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Coloque sua senha aqui
  database: 'dbvozativa',
};

let db;

async function initializeDb() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Erro ao conectar no banco de dados: ', err);
    log(`Erro ao conectar no banco de dados: ${err.message}`);
  }
}

module.exports = { db, initializeDb };

///////////////////////////////////////////////////////////////////////////////////////////////////////