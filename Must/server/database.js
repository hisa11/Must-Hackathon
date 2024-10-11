const mysql = require('mysql2/promise');
const config = require('./config');

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(config.dbConfig);
        console.log('MySQL connected successfully');
        return connection;
    } catch (error) {
        console.error('MySQL connection error:', error);
        throw error;
    }
}

module.exports = connectToDatabase;