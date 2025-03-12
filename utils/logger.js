const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.log');

const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
    console.log(logMessage);
};

module.exports = { log };
