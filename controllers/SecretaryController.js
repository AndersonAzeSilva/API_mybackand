const Secretary = require('../models/Secretary');
const db = require('../config/db'); // Importando a conexão com o banco de dados

exports.createSecretary = async (req, res) => {
  const { name, email, address, phone, profileImage, availableTimes } = req.body;

  if (!name || !email || !address || !phone || !availableTimes || availableTimes.length === 0) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [secretaryResult] = await Secretary.create(name, email, address, phone, profileImage);
    const secretaryId = secretaryResult.insertId;
    
    // Inserir os horários disponíveis...
    
    res.status(201).json({ id: secretaryId, name, email, address, phone, profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar a secretária' });
  }
};

// Listar as secretárias
exports.getAllSecretaries = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM secretaries');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar secretárias' });
  }
};

// Outros métodos como listSecretaries...
