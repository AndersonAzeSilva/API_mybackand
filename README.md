Descrição
A API Voz Ativa é uma aplicação Node.js utilizando Express.js e MySQL para gerenciar usuários e ocorrências. O sistema permite registro de novos usuários, login, cadastro de ocorrências e visualização de dados.

Requisitos

1. Antes de começar, certifique-se de ter os seguintes requisitos instalados:

Node.js (versão >= 14)
MySQL ou XAMPP para gerenciar o banco de dados
Git (opcional, para clonar o repositório)

2. Instalação
   
Siga as etapas abaixo para configurar e rodar o projeto localmente:

Clone o repositório:

git clone https://github.com/seuusuario/seurepositorio.git
cd API_mybackand

3. Instale as dependências:
   
npm install
Certifique-se de que o MySQL ou XAMPP esteja rodando.

Configuração

1. Crie um banco de dados no MySQL chamado appvozativa:

CREATE DATABASE appvozativa;

2. Configure o arquivo .env para definir as variáveis de ambiente. Crie o arquivo na raiz do projeto com o seguinte conteúdo:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=appvozativa
PORT=3000

3. Crie as tabelas necessárias no banco de dados executando os comandos SQL abaixo:

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  telefone VARCHAR(15),
  endereco VARCHAR(255)
);

CREATE TABLE incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  protocolNumber VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) NOT NULL,
  images JSON
);

Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos:
. npm start: Inicia o servidor na porta configurada (padrão: 3000).

Rotas e Funcionalidades

Usuários

1. Registrar um usuário
   
.Método: POST
.Rota: /register
.Corpo da requisição:

json
{
  "nome": "Nome do Usuário",
  "email": "email@exemplo.com",
  "senha": "senha123",
  "cpf": "123.456.789-00",
  "telefone": "11987654321",
  "endereco": "Rua Exemplo, 123"
}

Resposta: 201 - Usuário registrado com sucesso.

2. Login de usuário

. Método: POST
. Rota: /login
. Corpo da requisição:

json
{
  "email": "email@exemplo.com",
  "senha": "senha123"
}

Resposta: 200 - Login realizado com sucesso.

3. Obter lista de usuários

. Método: GET
. Rota: /dados
. Resposta: Retorna todos os usuários cadastrados.

Ocorrências

1. Registrar ou atualizar uma ocorrência

.Método: POST
.Rota: /incidents
.Corpo da requisição:

json
{
  "protocolNumber": "123456",
  "title": "Título da Ocorrência",
  "description": "Descrição detalhada",
  "type": "Tipo de Ocorrência",
  "date": "2024-01-01",
  "time": "10:30:00",
  "status": "aberto",
  "images": ["imagem1.png", "imagem2.jpg"]
}

Resposta: 201 ou 200 (dependendo se foi criada ou atualizada).

2. Obter lista de ocorrências

. Método: GET
. Rota: /incidents
. Resposta: Lista todas as ocorrências.

3. Excluir uma ocorrência

Método: DELETE
Rota: /incidents/:id
Resposta: 200 - Ocorrência excluída com sucesso.

Estrutura de Pastas

API_mybackand/
├── controllers/
│   ├── authController.js
│   └── incidentController.js
├── middlewares/
│   └── logger.js
├── routes/
│   ├── authRoutes.js
│   └── incidentRoutes.js
├── config/
│   └── db.js
├── server.js
├── package.json
└── README.md
