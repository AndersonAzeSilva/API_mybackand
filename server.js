const express = require('express'); // Importa o módulo express
const mysql = require('mysql2'); // Importa a biblioteca de conexão do MySQL
const bcrypt = require('bcrypt'); // Importa a biblioteca bcrypt para hashing de senhas

const app = express(); // Cria uma instância do express
const port = 3000; // Porta do servidor

///////////////////////////////////////////////////////////////////////////////////////////////
// Configuração da conexão com o banco de dados
///////////////////////////////////////////////////////////////////////////////////////////////
const db = mysql.createConnection({
  host: 'localhost', // Nome do local do banco de dados
  user: 'root', // Nome de usuário do banco de dados
  password: '', // Correção: "senha" para "password"
  database: 'appvozativa' // Nome do banco de dados
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados: ', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
});

///////////////////////////////////////////////////////////////////////////////////////////////
// Middleware para permitir que a API trate dados JSON
///////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.json());

///////////////////////////////////////////////////////////////////////////////////////////////
// Rota para registrar usuário
///////////////////////////////////////////////////////////////////////////////////////////////
app.post('/register', async (req, res) => {
  const { nome, email, senha, cpf, telefone, endereco } = req.body; // Removido o campo 'id'

  // Validação de campos obrigatórios
  if (!nome || !email || !senha || !cpf || !telefone || !endereco) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    // Gera o hash da senha
    const hashedsenha = await bcrypt.hash(senha, 10);

    // Query SQL sem o campo 'id', pois será auto incrementado
    const sql = 'INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nome, email, hashedsenha, cpf, telefone, endereco], (err, result) => {
      if (err) {
        console.error('Erro ao executar a query: ', err.sqlMessage); // Mostra a mensagem de erro do MySQL
        return res.status(500).json({ error: 'Erro ao registrar usuário no banco de dados.', details: err });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    });
    
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ error: 'Erro no processamento da requisição.' });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////
// Rota para obter dados do banco de dados
///////////////////////////////////////////////////////////////////////////////////////////////
app.get('/dados', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Erro ao executar a query: ', err);
      return res.status(500).json({ error: 'Erro ao obter dados.' });
    }
    res.json(results);
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////
// Inicialização do Servidor
///////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Conexão com Servidor realizada com sucesso rodando na porta: ${port}`); // Exibe a mensagem de Servidor rodando
});