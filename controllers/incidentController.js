// incidenteController.js

const db = require('../config/db');

//////////////////////////////////////////////////////////////////////////////////////
// Função para criar um novo incidente
//////////////////////////////////////////////////////////////////////////////////////
exports.createIncident = async (req, res) => {
  const { title, description, status, userId } = req.body;

  if (!title || !description || !status || !userId) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO incidents (title, description, status, user_id) VALUES (?, ?, ?, ?)',
      [title, description, status, userId]
    );
    res.status(201).json({ message: 'Incidente criado com sucesso!', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar incidente:', error);
    res.status(500).json({ message: 'Erro ao criar incidente.' });
  }
};

//////////////////////////////////////////////////////////////////////////////////////
// Função para listar todos os incidentes
//////////////////////////////////////////////////////////////////////////////////////
exports.getAllIncidents = async (req, res) => {
  try {
    const [incidents] = await db.query('SELECT * FROM incidents');
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Erro ao buscar incidentes:', error);
    res.status(500).json({ message: 'Erro ao buscar incidentes.' });
  }
};

//////////////////////////////////////////////////////////////////////////////////////
// Função para buscar um incidente específico pelo ID
//////////////////////////////////////////////////////////////////////////////////////
exports.getIncidentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [incident] = await db.query('SELECT * FROM incidents WHERE id = ?', [id]);

    if (incident.length === 0) {
      return res.status(404).json({ message: 'Incidente não encontrado.' });
    }

    res.status(200).json(incident[0]);
  } catch (error) {
    console.error('Erro ao buscar incidente:', error);
    res.status(500).json({ message: 'Erro ao buscar incidente.' });
  }
};

//////////////////////////////////////////////////////////////////////////////////////
// Controlador para atualizar um incidente
//////////////////////////////////////////////////////////////////////////////////////
exports.updateIncident = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE incidents SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incidente não encontrado.' });
    }

    res.status(200).json({ message: 'Incidente atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar incidente:', error);
    res.status(500).json({ message: 'Erro ao atualizar incidente.' });
  }
};

//////////////////////////////////////////////////////////////////////////////////////
// Controlador para excluir um incidente
//////////////////////////////////////////////////////////////////////////////////////
exports.deleteIncident = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM incidents WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incidente não encontrado.' });
    }

    res.status(200).json({ message: 'Incidente excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir incidente:', error);
    res.status(500).json({ message: 'Erro ao excluir incidente.' });
  }
};
//////////////////////////////////////////////////////////////////////////////////////
