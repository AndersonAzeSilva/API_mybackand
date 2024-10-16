////////////////////////////////////////////////////////////////////////////////
// Função para validar dados do usuário
////////////////////////////////////////////////////////////////////////////////
function validateUserData(data) {
    const { nome, email, senha, cpf, telefone, endereco } = data;
    return nome && email && senha && cpf && telefone && endereco;
}

////////////////////////////////////////////////////////////////////////////////
// Rota para registrar um novo usuário
////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////  
// Rota para login de usuário
////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
// Rota para obter todos os usuários
////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
// Rota para logout do usuário
////////////////////////////////////////////////////////////////////////////////
app.post('/logout', (req, res) => {
    res.json({ message: 'Logout realizado com sucesso!' });
});

////////////////////////////////////////////////////////////////////////////////
// Rota para atualizar perfil do usuário
////////////////////////////////////////////////////////////////////////////////
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