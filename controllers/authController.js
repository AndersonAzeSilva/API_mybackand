// authController.js

const db = require('../config/db'); // Importando a conexão com o banco de dados
const bcrypt = require('bcrypt'); // Para hashing de senhas
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Login
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Exemplo de verificação de usuário
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        // Verifica a senha
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // Gera um token JWT
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro ao realizar login.' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
