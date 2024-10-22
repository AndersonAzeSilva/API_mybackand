const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'secret_key'; // Defina sua chave secreta de JWT no .env
const db = require('../config/db'); // Importando a conexão com o banco de dados

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Middleware para verificar se o usuário está autenticado
/////////////////////////////////////////////////////////////////////////////////////////////////////
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // Aqui está a definição da variável token

  // Log para depuração
  console.log('Token recebido:', token);

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  const bearerToken = token.split(' ')[1]; // Caso o token venha como 'Bearer <token>'
  
  jwt.verify(bearerToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
    
    req.user = decoded; // Armazena o usuário decodificado para uso nas rotas
    next();
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Middleware para verificar se o usuário é administrador
/////////////////////////////////////////////////////////////////////////////////////////////////////
exports.verifyAdmin = (req, res, next) => {
  // Presume-se que no token decodificado haja uma propriedade `isAdmin` que defina o nível de acesso
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
  }
};
