const db = require('../utils/db');
const { Parser } = require('json2csv');

exports.getIncidents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [incidents] = await db.query('SELECT * FROM incidents LIMIT ?, ?', [offset, limit]);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ocorrências' });
  }
};

exports.exportIncidents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM incidents');
    const parser = new Parser();
    const csv = parser.parse(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ocorrencias.csv');
    res.status(200).end(csv);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exportar ocorrências' });
  }
};
