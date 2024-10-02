const { query } = require('../models/db');
const { log } = require('../middlewares/logger');

async function createOrUpdateIncident(req, res) {
  const { protocolNumber, title, description, type, date, time, status, images, assignedTo } = req.body;

  if (!protocolNumber || !title || !description || !type || !date || !time || !status) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const [existing] = await query('SELECT * FROM incidents WHERE protocolNumber = ?', [protocolNumber]);

    if (existing.length > 0) {
      const sql = 'UPDATE incidents SET title = ?, description = ?, type = ?, date = ?, time = ?, status = ?, images = ?, assignedTo = ? WHERE protocolNumber = ?';
      await query(sql, [title, description, type, date, time, status, JSON.stringify(images), assignedTo, protocolNumber]);
      res.status(200).json({ message: 'Ocorrência atualizada com sucesso!' });
    } else {
      const sql = 'INSERT INTO incidents (protocolNumber, title, description, type, date, time, status, images, assignedTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      await query(sql, [protocolNumber, title, description, type, date, time, status, JSON.stringify(images), assignedTo]);
      res.status(201).json({ message: 'Ocorrência registrada com sucesso!', protocolNumber });
    }
  } catch (error) {
    log(`Erro ao registrar ou atualizar ocorrência: ${error.message}`);
    res.status(500).json({ error: 'Erro ao registrar ou atualizar ocorrência no banco de dados.' });
  }
}

module.exports = { createOrUpdateIncident };
