module.exports = {
    port: process.env.PORT || 3000,
    secretKey: process.env.SECRET_KEY || 'your_secret_key',
    dbConfig: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'your_database'
    }
};