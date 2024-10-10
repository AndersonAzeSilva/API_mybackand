const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { log } = require('./logger'); // Importa a função de log
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client('SEU_CLIENT_ID_AQUI');

const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Coloque sua senha aqui
  database: 'appvozativa'
};

let db;

// Inicializa a conexão com o banco de dados
async function initializeDb() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Erro ao conectar no banco de dados: ', err);
    log(`Erro ao conectar no banco de dados: ${err.message}`);
  }
}

initializeDb();

// Middleware para tratar dados JSON e permitir CORS
app.use(express.json());
app.use(cors());

// Função para validar dados do usuário
function validateUserData(data) {
  const { nome, email, senha, cpf, telefone, endereco } = data;
  return nome && email && senha && cpf && telefone && endereco;
}

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
  const { nome, email, senha, cpf, telefone, endereco, isAdmin } = req.body;

  if (!validateUserData(req.body)) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const nivelUsuario = isAdmin ? 1 : 2; // Converte isAdmin para nível de usuário
    const sql = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, nivel) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.query(sql, [nome, email, hashedSenha, cpf, telefone, endereco, nivelUsuario]);

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    log(`Erro ao registrar usuário: ${error.message}`);
    res.status(500).json({ error: 'Erro ao registrar usuário no banco de dados.' });
  }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    log('Erro: Email ou senha não fornecidos.');
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length === 0) {
      log(`Falha de login: Email não encontrado - ${email}`);
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {
      log(`Falha de login: Senha incorreta para o email - ${email}`);
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const isAdmin = user.nivel === 1; // Considera nível 1 como administrador
    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        isAdmin // Adiciona esta propriedade
      }
    });
  } catch (err) {
    console.error('Erro ao acessar o banco de dados:', err);
    log(`Erro ao acessar o banco de dados: ${err.message}`);
    res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
  }
});

// Rota para obter todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM usuarios');
    res.json(results);
  } catch (err) {
    console.error('Erro ao executar a query:', err);
    log(`Erro ao executar a query: ${err.message}`);
    res.status(500).json({ error: 'Erro ao obter dados.' });
  }
});

// Função para validar dados de ocorrência
function validateIncidentData(data) {
  const { protocolNumber, title, description, type, date, time, status } = data;
  return protocolNumber && title && description && type && date && time && status;
}

// Rota para registrar uma nova ocorrência
app.post('/incidents', async (req, res) => {
  if (!validateIncidentData(req.body)) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  const { protocolNumber, title, description, type, date, time, status, images, assignedTo } = req.body;

  try {
    // Verifica se a ocorrência já existe
    const [existing] = await db.query('SELECT * FROM incidents WHERE protocolNumber = ?', [protocolNumber]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ocorrência com esse número de protocolo já existe!' });
    }

    const sql = 'INSERT INTO incidents (protocolNumber, title, description, type, date, time, status, images, assignedTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [protocolNumber, title, description, type, date, time, status, JSON.stringify(images), assignedTo];
    await db.query(sql, values);
    return res.status(201).json({ message: 'Ocorrência registrada com sucesso!', protocolNumber });

  } catch (error) {
    console.error('Erro ao registrar ocorrência:', error.message);
    log(`Erro ao registrar ocorrência: ${error.message}`);
    return res.status(500).json({ error: 'Erro ao registrar ocorrência no banco de dados.', details: error.message });
  }
});

app.put('/incidents/:protocolNumber', async (req, res) => {
  const { protocolNumber } = req.params;

  // Lista de status permitidos
  const validStatuses = ['pendente', 'em andamento', 'encerrado'];

  // Validação dos dados da requisição
  if (!validateIncidentData(req.body)) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  const { title, description, type, date, time, status, images, assignedTo } = req.body;

  try {
    // Verifica se a ocorrência existe
    const [existing] = await db.query('SELECT * FROM incidents WHERE protocolNumber = ?', [protocolNumber]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Ocorrência não encontrada!' });
    }

    // Valida se o status fornecido é válido
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: `Status inválido! Status permitidos: ${validStatuses.join(', ')}` });
    }

    // Verifica se o status é "encerrado" e mantém "encerrado" caso já esteja assim
    const currentStatus = existing[0].status.toLowerCase();
    const newStatus = currentStatus === 'encerrado' ? 'encerrado' : status.toLowerCase();

    // Só atualiza os dados se houverem mudanças (incluindo o status)
    const hasChanges = (
      title !== existing[0].title ||
      description !== existing[0].description ||
      type !== existing[0].type ||
      date !== existing[0].date ||
      time !== existing[0].time ||
      newStatus !== currentStatus ||
      JSON.stringify(images) !== JSON.stringify(existing[0].images) ||
      assignedTo !== existing[0].assignedTo
    );

    if (!hasChanges) {
      return res.status(200).json({ message: 'Nenhuma alteração detectada na ocorrência.' });
    }

    // Atualiza a ocorrência
    const sql = 'UPDATE incidents SET title = ?, description = ?, type = ?, date = ?, time = ?, status = ?, images = ?, assignedTo = ? WHERE protocolNumber = ?';
    const values = [title, description, type, date, time, newStatus, JSON.stringify(images), assignedTo, protocolNumber];
    
    await db.query(sql, values);
    
    return res.status(200).json({ message: 'Ocorrência atualizada com sucesso!', status: newStatus });

  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar ocorrência no banco de dados.', details: error.message });
  }
});

// Rota para obter todas as ocorrências
app.get('/incidents', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM incidents');

    const incidents = results.map(incident => {
      return {
        ...incident,
        images: incident.images ? JSON.parse(incident.images) : []
      };
    });

    res.json(incidents);
  } catch (err) {
    console.error('Erro ao buscar ocorrências:', err);
    log(`Erro ao buscar ocorrências: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar ocorrências no banco de dados.' });
  }
});

// Rota para excluir uma ocorrência
app.delete('/incidents/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM incidents WHERE id = ?';
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ocorrência não encontrada.' });
    }

    res.json({ message: 'Ocorrência excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir ocorrência:', error);
    log(`Erro ao excluir ocorrência: ${error.message}`);
    res.status(500).json({ error: 'Erro ao excluir ocorrência no banco de dados.' });
  }
});

// Rota para criar um chamado
app.post('/chamados', async (req, res) => {
  const { titulo, descricao, usuarioId } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const sql = 'INSERT INTO chamados (titulo, descricao, usuarioId) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [titulo, descricao, usuarioId]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Erro ao registrar chamado:', error);
    log(`Erro ao registrar chamado: ${error.message}`);
    res.status(500).json({ error: 'Erro ao registrar chamado no banco de dados.' });
  }
});

// Rota para buscar todos os chamados
app.get('/chamados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chamados');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    log(`Erro ao buscar chamados: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar chamados no banco de dados.' });
  }
});

// Rota para atualizar um chamado
app.put('/chamados/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const sql = 'UPDATE chamados SET titulo = ?, descricao = ? WHERE id = ?';
    const [result] = await db.query(sql, [titulo, descricao, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    res.json({ message: 'Chamado atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    log(`Erro ao atualizar chamado: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar chamado no banco de dados.' });
  }
});

// Rota para excluir um chamado
app.delete('/chamados/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM chamados WHERE id = ?';
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    res.json({ message: 'Chamado excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir chamado:', error);
    log(`Erro ao excluir chamado: ${error.message}`);
    res.status(500).json({ error: 'Erro ao excluir chamado no banco de dados.' });
  }
});

// Rota para exportar ocorrências para CSV
app.get('/export', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM incidents');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ocorrencias.csv');

    const header = Object.keys(rows[0]).join(',') + '\n';
    const csv = rows.map(row => {
      return Object.values(row).join(',');
    }).join('\n');

    res.send(header + csv);
  } catch (error) {
    console.error('Erro ao exportar ocorrências:', error);
    log(`Erro ao exportar ocorrências: ${error.message}`);
    res.status(500).json({ error: 'Erro ao exportar ocorrências.' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////
// Rota para login com Google
/////////////////////////////////////////////////////////////////////////////////////////
app.post('/login/google', async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
      return res.status(400).json({ error: 'Token do Google é obrigatório!' });
  }

  try {
      const ticket = await googleClient.verifyIdToken({
          idToken: id_token,
          audience: '119836842505-voh13dm2f4t8eb7toll5g3st288sp7gg.apps.googleusercontent.com', // Substitua pelo seu Client ID
      });
      const payload = ticket.getPayload();
      const email = payload.email;
      const nome = payload.name;

      // Verifica se o usuário já existe no banco de dados
      const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

      if (results.length === 0) {
          // Se não existir, registra o usuário
          const sql = 'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)';
          await db.query(sql, [nome, email, null, 2]); // Define o nível como 2 (Usuário normal)
      }

      // Realiza o login do usuário
      const [userResults] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      const user = userResults[0];
      const isAdmin = user.nivel === 1; // Considera nível 1 como administrador

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
});

// Rota para logout do usuário
app.post('/logout', (req, res) => {
  // Aqui você pode invalidar o token ou a sessão do usuário.
  // Se estiver usando tokens JWT, você pode optar por armazenar uma lista de tokens inválidos ou alterar o estado da sessão.

  // Para este exemplo, vamos simplesmente responder com uma mensagem de sucesso.
  res.json({ message: 'Logout realizado com sucesso!' });
});

// Rota para atualizar perfil do usuário
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, matricula, profilePicture } = req.body; // Campos a serem atualizados

  if (!name || !email || !matricula) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const sql = 'UPDATE users SET name = ?, email = ?, matricula = ?, profilePicture = ? WHERE id = ?';
    await db.query(sql, [name, email, matricula, profilePicture, userId]);
    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    log(`Erro ao atualizar perfil: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar perfil no banco de dados.' });
  }
});

// Rota para criar uma nova secretária
app.post('/secretaries', async (req, res) => {
  const { name, email, address, phone, profileImage, availableTimes } = req.body;

  try {
    // Inserir a secretária na tabela secretaries
    const [secretaryResult] = await db.execute(
      'INSERT INTO secretaries (name, email, address, phone, profile_image) VALUES (?, ?, ?, ?, ?)',
      [name, email, address, phone, profileImage]
    );

    const secretaryId = secretaryResult.insertId;

    // Inserir os horários disponíveis na tabela available_times
    for (const time of availableTimes) {
      await db.execute(
        'INSERT INTO available_times (secretary_id, start_time, end_time) VALUES (?, ?, ?)',
        [secretaryId, time.startTime, time.endTime]
      );
    }

    res.status(201).json({ id: secretaryId, name, email, address, phone, profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar a secretária' });
  }
});

// Rota para listar as secretárias
app.get('/secretaries', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM secretaries');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar secretárias' });
  }
});

// Rota para criar novos horários das secretárias
app.post('/schedules', async (req, res) => {
  const { secretary_id, start_time, end_time } = req.body;

  // Validação dos campos
  if (!secretary_id || !start_time || !end_time) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verifica se o secretary_id existe
    const [secretary] = await db.query('SELECT * FROM secretaries WHERE id = ?', [secretary_id]);
    if (secretary.length === 0) {
      return res.status(404).json({ message: 'Secretária não encontrada.' });
    }

    // Inserir o horário no banco de dados
    await db.query('INSERT INTO schedules (secretary_id, start_time, end_time) VALUES (?, ?, ?)', [secretary_id, start_time, end_time]);
    res.status(201).json({ message: 'Horário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar horário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar horário.' });
  }
});

// Rota para listar horários disponíveis de uma secretária em uma data específica
app.get('/available-times', async (req, res) => {
  const { date, secretaryId } = req.query;

  if (!date || !secretaryId) {
    return res.status(400).json({ message: 'Data e ID da secretária são obrigatórios.' });
  }

  try {
    const [times] = await db.query(
      'SELECT start_time, end_time FROM available_times WHERE secretary_id = ? AND DATE(start_time) = ?',
      [secretaryId, date]
    );
    res.status(200).json(times);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar horários disponíveis' });
  }
});

// Rota para criar um novo agendamento
app.post('/appointments', async (req, res) => {
  const { secretary_id, date, time, email } = req.body;

  if (!secretary_id || !date || !time || !email) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Aqui você deve inserir o agendamento na tabela correspondente
    await db.query(
      'INSERT INTO appointments (secretary_id, appointment_date, appointment_time, email) VALUES (?, ?, ?, ?)',
      [secretary_id, date, time, email]
    );
    res.status(201).json({ message: 'Agendamento criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar agendamento' });
  }
});

// Rota para listar as datas disponíveis com horários
app.get('/available-dates', async (req, res) => {
  const { secretaryId } = req.query;

  if (!secretaryId) {
    return res.status(400).json({ message: 'ID da secretária é obrigatório.' });
  }

  try {
    const [dates] = await db.query(
      'SELECT DISTINCT DATE(start_time) as availableDate FROM available_times WHERE secretary_id = ?',
      [secretaryId]
    );
    
    res.status(200).json(dates.map(row => row.availableDate)); // Retorna uma lista de datas
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar datas disponíveis.' });
  }
});


// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
