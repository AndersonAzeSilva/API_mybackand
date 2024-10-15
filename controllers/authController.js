const db = require('../models/db');
const { googleClient } = require('../config/google'); // Certifique-se de importar seu cliente Google.

exports.loginWithGoogle = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) {
    return res.status(400).json({ error: 'Token do Google é obrigatório!' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID, // Usar variável de ambiente para o Client ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const nome = payload.name;

    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (results.length === 0) {
      const sql = 'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)';
      await db.query(sql, [nome, email, null, 2]); // Define o nível como 2 (Usuário normal)
    }

    const [userResults] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = userResults[0];
    const isAdmin = user.nivel === 1;

    res.json({
      message: 'Login com Google realizado com sucesso!',
      user: {
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        isAdmin
      }
    });
  } catch (error) {
    console.error('Erro ao verificar token do Google:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// Adicione outras funções conforme necessário.
