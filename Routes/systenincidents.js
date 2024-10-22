///////////////////////////////////////////////////////////////////////////////////////////////////////
// Função para validar dados de ocorrência
///////////////////////////////////////////////////////////////////////////////////////////////////////
function validateIncidentData(data) {
    const { protocolNumber, title, description, type, date, time, status } = data;
    return protocolNumber && title && description && type && date && time && status;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////  
// Rota para registrar uma nova ocorrência
///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/incidents', async (req, res) => {
    if (!validateIncidentData(req.body)) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const { protocolNumber, title, description, type, date, time, status, images, assignedTo } = req.body;

    try {
        // Verifica se a ocorrência já existe no banco de dados
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

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Rota para obter todas as ocorrências
///////////////////////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Rota para excluir uma ocorrência
///////////////////////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////////////////////////