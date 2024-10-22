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
