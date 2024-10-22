<<<<<<< HEAD
const fs = require('fs');
const path = require('path');

function log(message) {
  const logFilePath = path.join(__dirname, '../logs', 'app.log');
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error('Erro ao gravar log:', err);
  });
}

module.exports = { log };
=======
// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'Logs', 'app.log');

// Função para escrever logs
const logger = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    // Cria a pasta 'logs' se não existir
    if (!fs.existsSync(path.join(__dirname, 'Logs'))) {
        fs.mkdirSync(path.join(__dirname, 'Logs'));
    }

    // Grava a mensagem no arquivo
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erro ao gravar no arquivo de log: ', err);
        }
    });
};

module.exports = logger;
>>>>>>> 7a0cc67a2285694973ad4489b45b825d37017f54
