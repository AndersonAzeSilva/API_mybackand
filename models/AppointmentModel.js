const db = require('../config/db');

// Criar um novo agendamento
exports.createAppointment = async (req, res) => {
  const { secretary_id, date, time, email } = req.body;

  if (!secretary_id || !date || !time || !email) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
      const [existingAppointment] = await db.query(
          'SELECT * FROM appointments WHERE secretary_id = ? AND appointment_date = ? AND appointment_time = ?',
          [secretary_id, date, time]
      );

      if (existingAppointment.length > 0) {
          return res.status(409).json({ message: 'Horário já está ocupado.' });
      }

      await db.query(
          'INSERT INTO appointments (secretary_id, appointment_date, appointment_time, email) VALUES (?, ?, ?, ?)',
          [secretary_id, date, time, email]
      );
      res.status(201).json({ message: 'Agendamento criado com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar agendamento' });
  }
};

// Listar agendamentos do usuário
exports.getMyAppointments = async (req, res) => {
  const { userEmail } = req.query;

  try {
      const [appointments] = await db.execute(
          'SELECT * FROM appointments WHERE user_email = ?',
          [userEmail]
      );
      res.json(appointments);
  } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar agendamentos', error });
  }
};

// Cancelar um agendamento
exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
      const [result] = await db.execute('DELETE FROM appointments WHERE id = ?', [id]);

      if (result.affectedRows > 0) {
          res.json({ message: 'Agendamento cancelado com sucesso!' });
      } else {
          res.status(404).json({ message: 'Agendamento não encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Erro ao cancelar o agendamento', error });
  }
};

module.exports = Appointment;
