const express = require('express');
const app = express();

// Importando as rotas
const incidentRoutes = require('./routes/incidentRoutes');
const chamadosRoutes = require('./routes/chamadosRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const secretaryRoutes = require('./routes/SecretaryRoutes');
const schedulesRoutes = require('./routes/schedulesRoutes'); // Nova rota para agendamentos

app.use(express.json());

// Usar as rotas
app.use('/incidents', incidentRoutes);
app.use('/chamados', chamadosRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/secretarias', secretaryRoutes); // Rota para secretárias
app.use('/schedules', schedulesRoutes); // Rota para agendamentos

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
