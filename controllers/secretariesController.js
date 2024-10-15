const db = require('../models/db');

exports.createSecretary = async (req, res) => {
  const { name, email, address, phone, profileImage, availableTimes } = req.body;

  if (!name || !email || !address || !phone || !availableTimes || availableTimes.length === 0) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios e horários disponíveis devem ser fornecidos.' });
  }

  try {
    const [secretaryResult] = await db.execute(
      'INSERT INTO secretaries (name, email, address, phone, profile_image) VALUES (?, ?, ?, ?, ?)',
      [name, email, address, phone, profileImage]
    );

    const secretaryId = secretaryResult.insertId;

    for (const time of availableTimes) {
      await db.execute(
        'INSERT INTO available_times (secretary_id, start_time, end_time) VALUES (?, ?, ?)',
        [secretaryId, time.start_time, time.end_time]
      );
    }

    res.status(201).json({ id: secretaryId, name, email, address, phone, profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar a secretária' });
  }
};

// Adicione outras funções conforme necessário.
