const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'logs', 'app.log');

function log(message) {
  const timeStampedMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFile, timeStampedMessage);
}

module.exports = { log };
