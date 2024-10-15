const db = require('../models/db');

exports.createChamado = async (req, res) => {
  const { titulo, descricao, usuarioId } = req.body;
  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const sql = 'INSERT INTO chamados (titulo, descricao, usuarioId) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [titulo, descricao, usuarioId]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Erro ao registrar chamado:', error);
    res.status(500).json({ error: 'Erro ao registrar chamado no banco de dados.' });
  }
};

// Adicione outras funções conforme necessário.
