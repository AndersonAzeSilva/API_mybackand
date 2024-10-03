const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const googleClient = new OAuth2Client('119836842505-voh13dm2f4t8eb7toll5g3st288sp7gg.apps.googleusercontent.com');

exports.googleLogin = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: '119836842505-voh13dm2f4t8eb7toll5g3st288sp7gg.apps.googleusercontent.com',
    });

    const { email, name } = ticket.getPayload();
    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (!user.length) {
      await db.query('INSERT INTO usuarios (nome, email, nivel) VALUES (?, ?, 2)', [name, email]);
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar com Google' });
  }
};
