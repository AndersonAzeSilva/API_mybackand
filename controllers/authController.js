// authController.js

const db = require('../config/db'); // Importando a conexão com o banco de dados
const jwt = require('jsonwebtoken');

// Função de login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Autenticação do usuário (você deve ajustar isso de acordo com seu sistema)
  const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  if (user.length === 0 || user[0].password !== password) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
};
