// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'app.log');

// Função para escrever logs
const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    // Cria a pasta 'logs' se não existir
    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
        fs.mkdirSync(path.join(__dirname, 'logs'));
    }

    // Grava a mensagem no arquivo
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erro ao gravar no arquivo de log: ', err);
        }
    });
};

module.exports = { log };