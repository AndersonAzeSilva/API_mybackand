// Importando os módulos necessários
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDb } = require('./config/db'); // Função para inicializar o banco de dados
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const secretaryRoutes = require('./routes/secretaryRoutes');

// Carregando variáveis de ambiente do arquivo .env
require('dotenv').config();

const app = express();

// Usando a porta definida no .env ou a porta padrão 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Para analisar o corpo da requisição em JSON
app.use(express.json()); // Para analisar o corpo da requisição em JSON

// Inicializa o banco de dados
initializeDb();

// Definindo as rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/secretaries', secretaryRoutes);

// Inicializando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
