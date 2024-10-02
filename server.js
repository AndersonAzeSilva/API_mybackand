const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
