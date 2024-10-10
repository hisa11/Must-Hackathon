const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

exports.viewUsers = async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM users');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'ユーザー一覧の取得に失敗しました。' });
    }
};

exports.addUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
        await connection.end();
        res.status(201).json({ message: 'ユーザーが追加されました。' });
    } catch (error) {
        res.status(500).json({ message: 'ユーザーの追加に失敗しました。' });
    }
};