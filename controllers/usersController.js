const db = require('../models/db');

exports.updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, email, matricula, profilePicture } = req.body;

  if (!name || !email || !matricula) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const sql = 'UPDATE users SET name = ?, email = ?, matricula = ?, profilePicture = ? WHERE id = ?';
    await db.query(sql, [name, email, matricula, profilePicture, userId]);
    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil no banco de dados.' });
  }
};

// Adicione outras funções conforme necessário.
