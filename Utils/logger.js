// logger.js
const fs = require('fs');
const path = require('path');

// Define o caminho do arquivo de log
const logFilePath = path.join(__dirname, 'logs', 'app.log');

// Função para escrever logs
const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    // Cria a pasta 'logs' se não existir
    const logsDirectory = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }

    // Grava a mensagem no arquivo
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erro ao gravar no arquivo de log: ', err);
        }
    });
};

// Exporta a função de log
module.exports = { log };
