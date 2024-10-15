const db = require('../models/db');

exports.getIncidents = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM incidents');
    const incidents = results.map(incident => ({
      ...incident,
      images: incident.images ? JSON.parse(incident.images) : []
    }));
    res.json(incidents);
  } catch (err) {
    console.error('Erro ao buscar ocorrências:', err);
    res.status(500).json({ error: 'Erro ao buscar ocorrências no banco de dados.' });
  }
};

exports.deleteIncident = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM incidents WHERE id = ?';
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ocorrência não encontrada.' });
    }
    res.json({ message: 'Ocorrência excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir ocorrência:', error);
    res.status(500).json({ error: 'Erro ao excluir ocorrência no banco de dados.' });
  }
};

// Adicione outras funções conforme necessário.
