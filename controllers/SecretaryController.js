const Secretary = require('../models/secretaryModel'); 
const db = require('../config/db'); // Importando a conexão com o banco de dados

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Criar uma secretária
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.createSecretary = async (req, res) => {
    const { name, email } = req.body; // Exemplo de campos

    if (!name || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO secretaries (name, email) VALUES (?, ?)',
            [name, email]
        );
        res.status(201).json({ message: 'Secretário criado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar secretário:', error);
        res.status(500).json({ message: 'Erro ao criar secretário.' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Listar todas as secretárias
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllSecretaries = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM secretaries');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar secretários' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Obtendo a secretária através do ID
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getSecretaryById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT * FROM secretaries WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Secretário não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter secretário:', error);
        res.status(500).json({ message: 'Erro ao obter secretário.' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Atualizar os dados da secretária
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateSecretary = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        await db.execute('UPDATE secretaries SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        res.status(200).json({ message: 'Secretário atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar secretário:', error);
        res.status(500).json({ message: 'Erro ao atualizar secretário.' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Excluir uma secretária cadastrada
///////////////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteSecretary = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.execute('DELETE FROM secretaries WHERE id = ?', [id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Secretário não encontrado.' });
        }
        res.status(200).json({ message: 'Secretário excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir secretário:', error);
        res.status(500).json({ message: 'Erro ao excluir secretário.' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
