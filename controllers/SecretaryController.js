const Secretary = require('../models/Secretary');

const SecretaryController = {
  async listSecretaries(req, res) {
    try {
      const secretaries = await Secretary.getAllSecretaries();
      res.status(200).json(secretaries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar secretárias' });
    }
  },

  async createSchedule(req, res) {
    const { secretary_id, start_time, end_time } = req.body;

    if (!secretary_id || !start_time || !end_time) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
      await Secretary.createSchedule(secretary_id, start_time, end_time);
      res.status(201).json({ message: 'Horário cadastrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao cadastrar horário:', error);
      res.status(500).json({ message: 'Erro ao cadastrar horário.' });
    }
  },

  async getAvailableTimes(req, res) {
    const { date, secretaryId } = req.query;

    if (!date || !secretaryId) {
      return res.status(400).json({ message: 'Data e ID da secretária são obrigatórios.' });
    }

    try {
      const times = await Secretary.getAvailableTimes(secretaryId, date);
      res.status(200).json(times);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar horários disponíveis' });
    }
  }
};

module.exports = SecretaryController;
