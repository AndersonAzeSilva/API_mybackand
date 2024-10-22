// secretaryModel.js

const db = require('../config/db'); // Importando a conexão com o banco de dados

// Aqui você pode adicionar funções para interagir com a tabela de secretárias
module.exports = {
  // Exemplo: função para buscar todas as secretárias
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM secretaries');
    return rows;
  },
  // Adicione mais funções conforme necessário
};
