const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { log } = require('./logger'); // Importa a função de log

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

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
<<<<<<< HEAD
  const { nome, email, senha, cpf, telefone, endereco, isAdmin } = req.body;
=======
  const { nome, email, senha, cpf, telefone, endereco } = req.body;
>>>>>>> 9133257f22d02f91338d5464c95136adc273a2bc

  if (!nome || !email || !senha || !cpf || !telefone || !endereco) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
<<<<<<< HEAD
    const nivelUsuario = isAdmin ? 1 : 2; // Converte isAdmin para nível de usuário
    const sql = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, nivel) VALUES (?, ?, ?, ?, ?, ?, ?)'; 
    await db.query(sql, [nome, email, hashedSenha, cpf, telefone, endereco, nivelUsuario]);
=======
    const sql = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(sql, [nome, email, hashedSenha, cpf, telefone, endereco]);
>>>>>>> 9133257f22d02f91338d5464c95136adc273a2bc

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

<<<<<<< HEAD
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
=======
    res.json({ message: 'Login realizado com sucesso!', user: { nome: user.nome, email: user.email } });
>>>>>>> 9133257f22d02f91338d5464c95136adc273a2bc
  } catch (err) {
    console.error('Erro ao acessar o banco de dados:', err);
    log(`Erro ao acessar o banco de dados: ${err.message}`);
    res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
  }
<<<<<<< HEAD
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

// Rota para registrar ou atualizar uma ocorrência
app.post('/incidents', async (req, res) => {
  const { protocolNumber, title, description, type, date, time, status, images } = req.body;

  if (!protocolNumber || !title || !description || !type || !date || !time || !status) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM incidents WHERE protocolNumber = ?', [protocolNumber]);

    if (existing.length > 0) {
      const sql = 'UPDATE incidents SET title = ?, description = ?, type = ?, date = ?, time = ?, status = ?, images = ? WHERE protocolNumber = ?';
      const values = [title, description, type, date, time, status, JSON.stringify(images), protocolNumber];
      await db.query(sql, values);
      return res.status(200).json({ message: 'Ocorrência atualizada com sucesso!' });
    } else {
      const sql = 'INSERT INTO incidents (protocolNumber, title, description, type, date, time, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [protocolNumber, title, description, type, date, time, status, JSON.stringify(images)];
      await db.query(sql, values);
      return res.status(201).json({ message: 'Ocorrência registrada com sucesso!', protocolNumber });
    }
    
  } catch (error) {
    console.error('Erro ao registrar ou atualizar ocorrência:', error.message);
    log(`Erro ao registrar ou atualizar ocorrência: ${error.message}`);
    return res.status(500).json({ error: 'Erro ao registrar ou atualizar ocorrência no banco de dados.', details: error.message });
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
  const { titulo, descricao } = req.body;
  
  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const sql = 'INSERT INTO chamados (titulo, descricao) VALUES (?, ?)';
    const [result] = await db.query(sql, [titulo, descricao]);
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

  try {
    await db.query('UPDATE chamados SET titulo = ?, descricao = ? WHERE id = ?', [titulo, descricao, id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    log(`Erro ao atualizar chamado: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar chamado no banco de dados.' });
  }
});

// Rota para deletar um chamado
app.delete('/chamados/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM chamados WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar chamado:', error);
    log(`Erro ao deletar chamado: ${error.message}`);
    res.status(500).json({ error: 'Erro ao deletar chamado no banco de dados.' });
  }
});

// Rota para obter o histórico
app.get('/historico', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM historico');
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    log(`Erro ao buscar histórico: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar histórico no banco de dados.' });
  }
});

// Rota para obter notificações
app.get('/notificacoes', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM notificacoes');
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar notificações:', err);
    log(`Erro ao buscar notificações: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar notificações no banco de dados.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
=======
});

// Rota para obter todos os usuários
app.get('/dados', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM usuarios');
    res.json(results);
  } catch (err) {
    console.error('Erro ao executar a query:', err);
    log(`Erro ao executar a query: ${err.message}`);
    res.status(500).json({ error: 'Erro ao obter dados.' });
  }
});

// Rota para registrar ou atualizar uma ocorrência
app.post('/incidents', async (req, res) => {
  const { protocolNumber, title, description, type, date, time, status, images } = req.body;

  if (!protocolNumber || !title || !description || !type || !date || !time || !status) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    // Verifica se a ocorrência já existe
    const [existing] = await db.query('SELECT * FROM incidents WHERE protocolNumber = ?', [protocolNumber]);

    if (existing.length > 0) {
      // Atualiza a ocorrência existente
      const sql = 'UPDATE incidents SET title = ?, description = ?, type = ?, date = ?, time = ?, status = ?, images = ? WHERE protocolNumber = ?';
      const values = [title, description, type, date, time, status, JSON.stringify(images), protocolNumber];
      await db.query(sql, values);
      return res.status(200).json({ message: 'Ocorrência atualizada com sucesso!' });
    } else {
      // Registra uma nova ocorrência
      const sql = 'INSERT INTO incidents (protocolNumber, title, description, type, date, time, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [protocolNumber, title, description, type, date, time, status, JSON.stringify(images)];
      await db.query(sql, values);
      return res.status(201).json({ message: 'Ocorrência registrada com sucesso!', protocolNumber });
    }
    
  } catch (error) {
    console.error('Erro ao registrar ou atualizar ocorrência:', error.message);
    log(`Erro ao registrar ou atualizar ocorrência: ${error.message}`);
    return res.status(500).json({ error: 'Erro ao registrar ou atualizar ocorrência no banco de dados.', details: error.message });
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

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
>>>>>>> 9133257f22d02f91338d5464c95136adc273a2bc
});
